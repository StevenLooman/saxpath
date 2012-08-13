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

State.prototype.matches = function(node, depth) {
    var match = this.matchesName(node);
    if (match && this.predicates) {
        match = match && this.matchesPredicate(node);
    }
    return match;
};

State.prototype.unmatches = function(tag, depth) {
    return depth < this.matchedDepth;
};


module.exports = State;
