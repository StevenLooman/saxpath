var util   = require('util');
var events = require('events');

var XPathParser = require('./xpath_parser');
var XmlRecorder = require('./xml_recorder');

var StartState            = require('./start_state');
var ChildState            = require('./child_state');
var SelfOrDescendantState = require('./self_or_descendant_state');


var debug = false;
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

/**
 * SaXPath parser which tests XPath against a SAX-XML-stream
 *
 * Does so by building a state machine and feeding nodes as input to it.
 */
function SaXPath(saxParser, xpath, recorder) {
    this.saxParser    = saxParser;
    this.currentDepth = 0;

    this.xpathExpr    = XPathParser.parse(xpath);
    var states        = this._parseXPathExpr(this.xpathExpr);
    this.currentState = states[0];

    this.recorder = recorder || new XmlRecorder();
    // order of binding is important here!
    // if the recorder is disabled too early, the node/tag will not be recorded!
    this.saxParser.on('opentag',  this.onOpenTag.bind(this));
    this.saxParser.on('opentag',  this.recorder.onOpenTag.bind(this.recorder));
    this.saxParser.on('closetag', this.recorder.onCloseTag.bind(this.recorder));
    this.saxParser.on('closetag', this.onCloseTag.bind(this));
    this.saxParser.on('text',     this.recorder.onText.bind(this.recorder));
    this.saxParser.on('end',      this.onEnd.bind(this));
}


util.inherits(SaXPath, events.EventEmitter);


/**
 * Build state, dependent on the axis
 */
SaXPath.prototype._buildState = function(part) {
    var axis       = part[0];
    var name       = part[1];
    var predicates = part[2];

    if (axis === '/') {
        return new ChildState(axis, name, predicates);
    } else if (axis === '//') {
        return new SelfOrDescendantState(axis, name, predicates);
    }
};


/**
 * Parse an XPath expression and build the state-stack
 *
 * Uses the XPathParser class for this
 */
SaXPath.prototype._parseXPathExpr = function(expr) {
    var stack = [];

    // push the start/dummy state
    var start = new StartState();
    stack.push(start);

    var previousState = start;
    var i;
    for (i = 0; i < expr.length; ++i) {
        var part = expr[i];
        var state = this._buildState(part);

        // build links to previous/next state
        state.previous = previousState;
        previousState.next = state;

        // bookkeeping
        stack.push(state);
        previousState = state;
    }

    return stack;
};


/**
 * Test if the current state matches this node
 */
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

/**
 * Test if the current state unmatches this node
 */
SaXPath.prototype.onCloseTag = function(tag) {
    trace(this.currentDepth, '=== close tag, node: ' + tag + ' depth: ' + this.currentDepth + ' current state: ' + this.currentState.toString());

    var state = this.currentState;
    var stopRecorder = !state.next;

    // current node no longer matches the top of the stack?
    if (state.unmatches(tag, this.currentDepth)) {
        // if we are at the top of the state-stack, stop the recorder
        if (stopRecorder) {
            var xml = this.recorder.stop();

            this.emit('match', xml);
        }

        // hop to previous state
        this.currentState = state.previous;
    }

    this.currentDepth -= 1;
};


/**
 * End of the sax stream
 */
SaXPath.prototype.onEnd = function() {
    trace(0, '=== end');
    this.emit('end');
};

module.exports = SaXPath;
