var util   = require('util');

var State = require('./state');


var debug = false;
function trace(message) {
    if (debug) {
        console.log(message);
    }
}


/**
 * State representing a self-or-descendant-axis
 */
function SelfOrDescendantState(axis, name, predicates) {
    this.doFork = true;
    this.id = this._generateId();

    this.abbrevAxis = '//';
    this.axis = 'self-or-descendant';
    this.name = name;
    this.predicates = this._initPredicates(predicates);
}


util.inherits(SelfOrDescendantState, State);


/**
 * Match this node?
 */
SelfOrDescendantState.prototype.matches = function(node, depth) {
    trace('// match? node: ' + node.name + ' depth: ' + depth);
    var match = this._matchesName(node) && this._matchesPredicate(node);
    if (match) {
        trace('// match');

        this.enteredDepth = depth;
    }
    return match;
};

/**
 * Unmatch this node?
 */
SelfOrDescendantState.prototype.unmatches = function(tag, depth) {
    trace('// unmatch? depth: ' + depth + ' enteredDepth: ' + this.enteredDepth);
    var unmatch = depth <= this.enteredDepth;
    if (unmatch) {
        trace('// unmatch');
    }
    return unmatch;
};





module.exports = SelfOrDescendantState;
