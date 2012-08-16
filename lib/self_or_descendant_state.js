var debug = true;
function trace(message) {
    if (debug) {
        console.log(message);
    }
}


function SelfOrDescendantState(axis, name, predicates) {
    this.axis = 'self-or-descendant';
    this.name = name;

    if (predicates) {
        // strip '[' and ']'
        this.predicates = predicates.slice(1).slice(0, -1);
    }
}


//SelfOrDescendantState.prototype.enter = function(depth) {
//    trace('// state enter, state: ' + this.name + ' depth: ' + depth);
//    this.enteredDepth = depth;
//};
//
//SelfOrDescendantState.prototype.leave = function(depth) {
//    trace('// state leave, state: ' + this.name + ' depth: ' + depth);
//};


SelfOrDescendantState.prototype.matches = function(node, depth) {
    trace('// match? node: ' + node.name + ' depth: ' + depth);
    var match = this.matchesName(node);
    if (match && this.predicates) {
        match = match && this.matchesPredicate(node);
    }
    if (match) {
        trace('// match');

        this.enteredDepth = depth;
    }
    return match;
};

SelfOrDescendantState.prototype.unmatches = function(tag, depth) {
    trace('// unmatch? depth: ' + depth + ' enteredDepth: ' + this.enteredDepth);
    var unmatch = depth <= this.enteredDepth;
    if (unmatch) {
        trace('// unmatch');
    }
    return unmatch;
};

SelfOrDescendantState.prototype.matchesName = function(node) {
    return node.name === this.name;
};

SelfOrDescendantState.prototype.matchesPredicate = function(node) {
    // XXX: hardcoded to test @attr = literal
    var predicate = this.predicates[0];

    var left = predicate[0];
    var op = predicate[1];
    var right = predicate[2];

    var lValue = node.attributes[left[1]];
    var rValue = right;
    if (op === '=') {
        return lValue === rValue;
    }

    return false;
};


SelfOrDescendantState.prototype.toString = function() {
    return '//' + this.name;
};


module.exports = SelfOrDescendantState;
