var util   = require('util');

var State = require('./state');


/**
 * State representing a self-or-descendant-axis
 */
function SelfOrDescendantState(axis, namespace, name, predicates) {
    this.doFork = true;
    this.id = this._generateId();

    this.abbrevAxis = '//';
    this.axis = 'self-or-descendant';
    this.namespace = namespace;
    this.name = name;
    this.predicates = this._initPredicates(predicates);
}


util.inherits(SelfOrDescendantState, State);


/**
 * Match this node?
 */
SelfOrDescendantState.prototype.matches = function(node, depth) {
    var match = this._matchesName(node) && this._matchesPredicate(node);
    if (match) {
        this.enteredDepth = depth;
    }
    return match;
};

/**
 * Unmatch this node?
 */
SelfOrDescendantState.prototype.unmatches = function(tag, depth) {
    var unmatch = depth <= this.enteredDepth;
    return unmatch;
};





module.exports = SelfOrDescendantState;
