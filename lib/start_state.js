var util   = require('util');

var State = require('./state');


var debug = false;
function trace(message) {
    if (debug) {
        console.log(message);
    }
}


/**
 * Start state for the state-stack
 *
 * Always matches, never unmatches
 */
function StartState() {
    this.id = this._generateId();

    this.axis = '0';
    this.abbrevAxis = '0';

    this.predicates = [];
}


util.inherits(StartState, State);


/**
 * Match this node? (always true)
 */
StartState.prototype.matches = function(node, depth) {
    this.enteredDepth = depth;

    trace('0 match? node: ' + node.name + ' depth: ' + depth);
    trace('0 match');
    return true;
};

/**
 * Unmatch this node? (always false)
 */
StartState.prototype.unmatches = function(tag, depth) {
    trace('0 unmatch? depth: ' + depth + ' enteredDepth: ' + this.enteredDepth);
    return this.enteredDepth >= depth;
};


/**
 * toString
 * overrides State.toString
 */
StartState.prototype.toString = function() {
    return this.abbrevAxis;
};


module.exports = StartState;
