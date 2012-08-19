var util   = require('util');

var State = require('./state');


var debug = false;
function trace(message) {
    if (debug) {
        console.log(message);
    }
}


/**
 * State representing a child-axis
 */
function ChildState(axis, name, predicates) {
    this.id = this._generateId();

    this.abbrevAxis = '/';
    this.axis = 'child';
    this.name = name;
    this.predicates = this._initPredicates(predicates);
}


util.inherits(ChildState, State);


/**
 * Match this node?
 */
ChildState.prototype.matches = function(node, depth) {
    trace('/ match? node: ' + node.name + ' depth: ' + depth);
    var match = this._matchesName(node) && this._matchesDepth(depth) && this._matchesPredicate(node);

    if (match) {
        trace('/ match');

        this.enteredDepth = depth;
    }

    return match;
};

/**
 * Unmatch this node?
 */
ChildState.prototype.unmatches = function(tag, depth) {
    trace('/ unmatch? depth: ' + depth + ' enteredDepth: ' + this.enteredDepth);
    var unmatch = depth <= this.enteredDepth;
    if (unmatch) {
        trace('/ unmatch');
    }
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
