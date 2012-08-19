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
    this.axis = 'child';
    this.name = name;

    if (predicates) {
        // strip '[' and ']'
        this.predicates = predicates.slice(1).slice(0, -1);
    }
}


/**
 * Match this node?
 */
ChildState.prototype.matches = function(node, depth) {
    trace('/ match? node: ' + node.name + ' depth: ' + depth);
    var match = this._matchesName(node) && this._matchesDepth(depth);
    if (match && this.predicates) {
        match = match && this._matchesPredicate(node);
    }

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

ChildState.prototype._matchesName = function(node) {
    return node.name === this.name;
};

ChildState.prototype._matchesPredicate = function(node) {
    // XXX: hardcoded to test @attr = literal
    var i;
    for (i = 0; i < this.predicates.length; ++i) {
        var predicate = this.predicates[i];

        var left = predicate[0];
        var op = predicate[1];
        var right = predicate[2];

        var lValue = node.attributes[left[1]];
        var rValue = right;
        if (op === '=') {
            if (lValue !== rValue) {
                return false;
            }
        }
    }

    return true;
};


/*
 * toString
 */
ChildState.prototype.toString = function() {
    var i;
    var pred = '';

    if (this.predicates) {
        pred += '[';

        for (i = 0; i < this.predicates.length; ++i) {
            var predicate = this.predicates[i];

            var left = predicate[0];
            var op = predicate[1];
            var right = predicate[2];

            pred += left[0] + left[1] + op + '"' + right + '"';
        }

        pred += ']';
    }

    return '/' + this.name + pred;
};


module.exports = ChildState;
