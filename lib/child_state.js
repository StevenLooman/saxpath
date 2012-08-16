var debug = true;
function trace(message) {
    if (debug) {
        console.log(message);
    }
}


function ChildState(axis, name, predicates) {
    this.axis = 'child';
    this.name = name;

    if (predicates) {
        // strip '[' and ']'
        this.predicates = predicates.slice(1).slice(0, -1);
    }
}


ChildState.prototype.matches = function(node, depth) {
    trace('/ match? node: ' + node.name + ' depth: ' + depth);
    var match = this.matchesName(node) && this.matchesDepth(depth);
    if (match && this.predicates) {
        match = match && this.matchesPredicate(node);
    }

    if (match) {
        trace('/ match');

        this.enteredDepth = depth;
    }

    return match;
};

ChildState.prototype.unmatches = function(tag, depth) {
    trace('/ unmatch? depth: ' + depth + ' enteredDepth: ' + this.enteredDepth);
    var unmatch = depth <= this.enteredDepth;
    if (unmatch) {
        trace('/ unmatch');
    }
    return unmatch;
};

ChildState.prototype.matchesDepth = function(depth) {
    var parentDepth = this.previous.enteredDepth;
    return depth === parentDepth + 1;
};

ChildState.prototype.matchesName = function(node) {
    return node.name === this.name;
};

ChildState.prototype.matchesPredicate = function(node) {
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


ChildState.prototype.toString = function() {
    return '/' + this.name;
};


module.exports = ChildState;
