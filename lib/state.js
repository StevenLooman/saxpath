function State(part) {
    this.matchedDepth = -1;

    var axis = part[0];
    var name = part[1];
    var predicates = part[2];

    if (axis === '/') {
        this.axis = 'child';
        this.name = name;
        this.immediate = true;

        if (predicates) {
            // strip '[' and ']'
            this.predicates = predicates.slice(1).slice(0, -1);
        }
    }

    this.matchedDepth = -1;
}


State.prototype.enter = function(depth) {
    console.log('state enter, state:', this.name, 'depth:', depth);
    this.enteredDepth = depth;
};

State.prototype.leave = function(depth) {
    console.log('state leave, state:', this.name, 'depth:', depth);
    this.enteredDepth = null;
};


State.prototype.matches = function(node, depth) {
    var match = this.matchesName(node);
    if (match && this.predicates) {
        match = match && this.matchesPredicate(node);
    }
    if (match && this.axis === 'child') {
        match = match && this.matchesDepth(depth);
    }
    if (match) {
        console.log('match');
    }
    return match;
};

State.prototype.unmatches = function(tag, depth) {
    var unmatch = depth < this.matchedDepth;
    if (unmatch) {
        console.log('unmatch');
    }
    return unmatch;
};

State.prototype.matchesDepth = function(depth) {
    return depth === this.enteredDepth + 1;
};

State.prototype.matchesName = function(node) {
    return node.name === this.name;
};

State.prototype.matchesPredicate = function(node) {
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


module.exports = State;
