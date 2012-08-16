var util   = require('util');
var events = require('events');

var XPathParser = require('./xpath_parser');
var Recorder    = require('./recorder');

var StartState            = require('./start_state');
var ChildState            = require('./child_state');
var SelfOrDescendantState = require('./self_or_descendant_state');

var debug = true;
function trace(depth, message) {
    var i;

    if (debug) {
        var prefix = '';
        for (i = 0; i < depth; ++i) {
            prefix += '  ';
        }
        console.log(prefix + message);
    }
}

function SaXPath(saxParser, xpath, recorder) {
    this.currentDepth = 0;

    this.saxParser = saxParser;

    this.saxParser.on('opentag', this.onOpenTag.bind(this));
    this.saxParser.on('closetag', this.onCloseTag.bind(this));
    this.saxParser.on('text', this.onText.bind(this));
    this.saxParser.on('end', this.onEnd.bind(this));

    this.recorder = recorder || new Recorder();
    this.saxParser.on('opentag', this.recorder.onOpenTag.bind(this.recorder));
    this.saxParser.on('closetag', this.recorder.onCloseTag.bind(this.recorder));
    this.saxParser.on('text', this.recorder.onText.bind(this.recorder));

    this.xpathExpr = XPathParser.parse(xpath);
    this.states = this.parseXPathExpr(this.xpathExpr);
    this.currentState = this.states[0];
}


util.inherits(SaXPath, events.EventEmitter);


SaXPath.prototype.buildState = function(part) {
    var axis       = part[0];
    var name       = part[1];
    var predicates = part[2];

    if (axis === '/') {
        return new ChildState(axis, name, predicates);
    } else if (axis === '//') {
        return new SelfOrDescendantState(axis, name, predicates);
    }
};


SaXPath.prototype.parseXPathExpr = function(expr) {
    var stack = [];

    var start = new StartState();
    stack.push(start);
    var previousState = start;

    var i;
    for (i = 0; i < expr.length; ++i) {
        var part = expr[i];
        var state = this.buildState(part);

        state.previous = previousState;
        previousState.next = state;

        stack.push(state);
        previousState = state;
    }

    return stack;
};


SaXPath.prototype.onOpenTag = function(node) {
    this.currentDepth += 1;
    trace(this.currentDepth, '=== open tag, node: ' + node.name + ' depth: ' + this.currentDepth + ' current state: ' + this.currentState.toString());

    var state = this.currentState;
    if (state.next) {
        // still matching states
        if (state.next.matches(node, this.currentDepth)) {
            // hop to next state
            state = state.next;

            // start recording if the top of the stack has been reached
            if (!state.next) {
                this.recorder.start();
            }

            this.currentState = state;
        }
    }
};

SaXPath.prototype.onCloseTag = function(tag) {
    trace(this.currentDepth, '=== close tag, node: ' + tag + ' depth: ' + this.currentDepth + ' current state: ' + this.currentState.toString());

    var state = this.currentState;
    var stopRecorder = !state.next;

    if (state.unmatches(tag, this.currentDepth)) {
        if (stopRecorder) {
            this.recorder.stop();
        }

        state = state.previous;
        this.currentState = state;
    }

//    if (this.currentState === this.states.length) {
//        // top of the state, recording nodes
//        state = this.states[this.states.length - 1];
//        if (state.unmatches(tag, this.currentDepth)) {
//            this.recorder.stop();
//            this.currentState -= 1;
//        }
//    } else {
//        // still matching nodes
//        state = this.states[this.currentState];
//        if (state.unmatches(tag, this.currentDepth)) {
//            this.currentState -= 1;
//        }
//    }

    this.currentDepth -= 1;

//    var state;
//    var prev;
//    if (this.currentState === this.states.length) {
//        // at the top of the stack, recording
//        state = this.states[this.currentState - 1];
//
//        prev = state.previous;
//        if (prev.unmatches(tag, this.currentDepth)) {
//            this.recorder.stop();
//
//            // go back a state
//            this.currentState -= 1;
//        }
//    } else if (this.currentState < this.states.length) {
//        state = this.states[this.currentState];
//
//        prev = state.previous;
//        if (state.unmatches(tag, this.currentDepth)) {
//            // go back a state
//            this.currentState -= 1;
//        }
//    }
};

SaXPath.prototype.onText = function(text) {
//    trace(this.currentDepth, '=== text');
};

SaXPath.prototype.onEnd = function() {
    trace(0, '=== end');
    this.emit('end');
};

module.exports = SaXPath;
