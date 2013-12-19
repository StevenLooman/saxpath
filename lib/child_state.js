var util   = require('util');

var State = require('./state');


/**
 * State representing a child-axis
 */
function ChildState(axis, namespace, name, predicates) {
    this.id = this._generateId();

    this.abbrevAxis = '/';
    this.axis = 'child';
    this.namespace = namespace;
    this.name = name;
    this.predicates = this._initPredicates(predicates);
}


util.inherits(ChildState, State);


/**
 * Match this node?
 */
ChildState.prototype.matches = function(node, depth) {
    var match = this._matchesName(node) && this._matchesDepth(depth) && this._matchesPredicate(node);
    if (match) {
        this.enteredDepth = depth;
    }
    return match;
};

/**
 * Unmatch this node?
 */
ChildState.prototype.unmatches = function(tag, depth) {
    var unmatch = depth <= this.enteredDepth;
    return unmatch;
};


ChildState.prototype._matchesDepth = function(depth) {
    var parentDepth = this.previous.enteredDepth;
    return depth === parentDepth + 1;
};


/*
 * toString
 */
ChildState.prototype.toString = function() {
    return '/' + this.name + this._predicatesToString();
};


module.exports = ChildState;
