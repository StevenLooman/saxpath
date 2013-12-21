var events = require('events');
var util   = require('util');

var XPathParser = require('./xpath_parser');
var XmlRecorder = require('./xml_recorder');

var StartState            = require('./start_state');
var ChildState            = require('./child_state');
var SelfOrDescendantState = require('./self_or_descendant_state');


/**
 * SaXPath parser which tests XPath against a SAX-XML-stream
 *
 * Does so by building a state machine and feeding nodes as input to it.
 *
 * E.g. XPath expression: /bookstore/book
 * (s0)  -- s1.match: bookstore --> (s1)  -- s2.match: book --> (s2)
 * (s0) <-- s1.unmatch          --  (s1) <-- s2.unmatch     --  (s2)
 *
 * (s0) is a special dummy state: StartState
 * (s1) is /bookstore state
 * (s2) is /book state
 * When (s2) is matched, the recorder is started
 * When (s2) is unmatched, the recorder is stopped
 */
function SaXPath(saxParser, xpath, recorder) {
    this.saxParser    = saxParser;
    this.currentDepth = 0;

    this.xpathExpr    = XPathParser.parse(xpath);
    this.activeStates = [ this._parseXPathExpr(this.xpathExpr) ];
    this.activeStates[0].matches('', 0);

    this.recorder = recorder || new XmlRecorder();

    // order of binding is important here!
    // if the recorder is disabled too early, the node/tag will not be recorded
    var self = this;
    this.saxParser.on('opentag',    function(node)  { self.onOpenTag(node); });
    this.saxParser.on('opentag',    function(node)  { self.recorder.onOpenTag(node); });
    this.saxParser.on('closetag',   function(tag)   { self.recorder.onCloseTag(tag); });
    this.saxParser.on('closetag',   function(tag)   { self.onCloseTag(self); });
    this.saxParser.on('text',       function(text)  { self.recorder.onText(text); });
    this.saxParser.on('opencdata',  function(tag)   { self.recorder.onOpenCDATA(tag); });
    this.saxParser.on('cdata',      function(cdata) { self.recorder.onCDATA(cdata); });
    this.saxParser.on('closecdata', function(tag)   { self.recorder.onCloseCDATA(tag); });
    this.saxParser.on('end',        function()      { self.onEnd(); });
}


util.inherits(SaXPath, events.EventEmitter);


/**
 * Build state, dependent on the axis
 */
SaXPath.prototype._buildState = function(part) {
    var axis       = part[0];
    var namespace  = part[1];
    var name       = part[2];
    var predicates = part[3];

    // build state dependent on axis
    if (axis === '/') {
        return new ChildState(axis, namespace, name, predicates);
    } else if (axis === '//') {
        return new SelfOrDescendantState(axis, namespace, name, predicates);
    } else {
        throw new Error('Unsupported axis');
    }
};


/**
 * Parse an XPath expression and build the state-stack
 *
 * Uses the XPathParser class for this
 */
SaXPath.prototype._parseXPathExpr = function(expr) {
    // push the start/dummy state
    var start = new StartState();

    var previousState = start;
    var i;
    for (i = 0; i < expr.length; ++i) {
        var part = expr[i];
        var state = this._buildState(part);

        // build links to previous/next state
        state.previous = previousState;
        previousState.next = state;

        // bookkeeping
        previousState = state;
    }

    return start;
};


SaXPath.prototype._fork = function(state, depth) {
    // stringify states-expression, from current state
    var str = '';
    var cur = state;
    while (cur) {
        str += cur.toString();
        cur = cur.next;
    }

    // parse expression
    var expr = XPathParser.parse(str);
    var fork = this._parseXPathExpr(expr);

    // mark the forked states as forks
    fork.isFork = true;
    fork.enteredDepth = depth;

    return fork;
};


/**
 * Test if the current state matches this node
 */
SaXPath.prototype.onOpenTag = function(node) {
    this.currentDepth += 1;

    var newActiveStates = [];

    var i;
    for (i = 0; i < this.activeStates.length; ++i) {
        var state = this.activeStates[i];
        var r = this._handleOpenTag(state, node);
        newActiveStates.push(r[0]);

        if (r[1]) {
            newActiveStates.push(r[1]);
        }
    }

    this.activeStates = newActiveStates;
};

/**
 * Test if the current state unmatches this node
 */
SaXPath.prototype.onCloseTag = function(tag) {
    var newActiveStates = [];

    var i;
    for (i = 0; i < this.activeStates.length; ++i) {
        var state = this.activeStates[i];
        var r = this._handleCloseTag(state, tag);

        if (r) {
            newActiveStates.push(r);
        }
    }

    this.activeStates = newActiveStates;

    this.currentDepth -= 1;
};

SaXPath.prototype._handleOpenTag = function(state, node) {
    var newState = state;
    var forkedState = null;

    if (state.next) {
        // still matching states
        if (state.next.matches(node, this.currentDepth)) {
            // do fork here?
            if (state.next.doFork) {
                forkedState = this._fork(state.next, this.currentDepth);
            }

            // hop to next state
            state = state.next;

            // start recording if the top of the stack has been reached
            if (!state.next) {
                this.recorder.start(state);
            }

            newState = state;
        }
    }

    return [ newState, forkedState ];
};

SaXPath.prototype._handleCloseTag = function(state, tag) {
    var newState = state;
    var stopRecorder = !state.next;

    // current node no longer matches the top of the stack?
    if (state.unmatches(tag, this.currentDepth)) {
        // if we are at the top of the state-stack, stop the recorder
        if (stopRecorder) {
            var xml = this.recorder.stop(state);
            this.emit('match', xml);
        }

        // forked here? then remove this state-stack
        if (state.isFork) {
            newState = null;
        } else {
            // hop to previous state
            newState = state.previous;
        }
    }

    return newState;
};


/**
 * End of the sax stream
 */
SaXPath.prototype.onEnd = function() {
    this.emit('end');
};

module.exports = SaXPath;
