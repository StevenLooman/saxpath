var events = require('events');
var util = require('util');
var XPathParser = require('./xpath_parser');
var State = require('./state');
var Recorder = require('./recorder');


function SaXPath(saxParser, xpath) {
    this.saxParser = saxParser;

    this.saxParser.on('opentag', this.onOpenTag.bind(this));
    this.saxParser.on('closetag', this.onCloseTag.bind(this));
    this.saxParser.on('text', this.onText.bind(this));
    this.saxParser.on('end', this.onEnd.bind(this));

    this.recorder = new Recorder();
    this.saxParser.on('opentag', this.recorder.onOpenTag.bind(this.recorder));
    this.saxParser.on('closetag', this.recorder.onCloseTag.bind(this.recorder));
    this.saxParser.on('text', this.recorder.onText.bind(this.recorder));

    this.xpathExpr = XPathParser.parse(xpath);
    this.states = this.parseXPathExpr(this.xpathExpr);

    this.currentDepth = -1;
    this.currentState = 0;
    this.recordingDepth = -1;
}


util.inherits(SaXPath, events.EventEmitter);


SaXPath.prototype.parseXPathExpr = function(expr) {
    var stack = [];

    var i;
    var previousState = null; // XXX: dummy state?
    for (i = 0; i < expr.length; ++i) {
        var part = expr[i];
        var state = new State(part);

        if (previousState) {
            state.previous = previousState;
            previousState.next = state;
        } else {
            previousState = state;
        }

        stack.push(state);
    }

    return stack;
};


SaXPath.prototype.isRecording = function() {
    return this.recordingDepth !== -1 && this.currentDepth >= this.recordingDepth;
};


SaXPath.prototype.onOpenTag = function(node) {
    this.currentDepth += 1;
    console.log('=== open tag', node, this.currentDepth);

    if (this.currentState < this.states.length) {
        // still matching states
        var state = this.states[this.currentState];
        console.log('current state:', state.name, state.matchedDepth);

        if (state.matches(node, this.currentDepth)) {
            // move forward a state
            console.log('match current state by name and predicate');
            state.matchedDepth = this.currentDepth;
            this.currentState += 1;
        }
    }

    // have we reached the top of the state-stack?
    if (this.currentState === this.states.length && this.recordingDepth === -1) {
        this.recordingDepth = this.currentDepth;
        this.recorder.start();
    }
};

SaXPath.prototype.onCloseTag = function(tag) {
    this.currentDepth -= 1;
    console.log('=== close tag', tag, this.currentDepth);

    var state = this.states[this.currentState - 1];
    if (state.unmatches(tag, this.currentDepth)) {
        console.log('unmatch');
        state.matchedDepth = -1;

        if (this.recordingDepth !== -1) {
            // stop recording
            this.recordingDepth = -1;
            this.recorder.stop();
        }

        // go back a state
        this.currentState -= 1;
    }
};

SaXPath.prototype.onText = function(text) {
//    console.log('=== text', text);
    var state = this.states[this.currentState];
};

SaXPath.prototype.onEnd = function() {
    console.log('=== end');
    this.emit('end');
};

module.exports = SaXPath;
