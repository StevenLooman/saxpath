function State() {
}


State.prototype._generateId = function() {
    return new Date().getTime() + '-' + Math.round(Math.random() * 65535);
};


State.prototype._initPredicates = function(predicates) {
    if (predicates) {
        // strip '[' and ']'
        return predicates.slice(1).slice(0, -1);
    }

    return [];
};


State.prototype._matchesName = function(node) {
    var expr = '^' + this._namespaceToString() + this.name + '$';
    // XPath specifies that the wildcard * stands for any character
    expr = expr.replace(/\*/g, '[a-z_][0-9a-z_]+');
    var regex = new RegExp(expr);

    return node.name.match(regex, {ignoreCase: true}) !== null;
};

State.prototype._matchesPredicate = function(node) {
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


State.prototype._namespaceToString = function() {
    if (!this.namespace) {
        return '';
    }

    return this.namespace + ':';
};

State.prototype._predicatesToString = function() {
    var pred = '';
    if (this.predicates.length > 0) {
        pred += '[';

        var i;
        for (i = 0; i < this.predicates.length; ++i) {
            var predicate = this.predicates[i];

            var left = predicate[0];
            var op = predicate[1];
            var right = predicate[2];

            pred += left[0] + left[1] + op + '"' + right + '"';
        }

        pred += ']';
    }

    return pred;
};


/*
 * toString
 */
State.prototype.toString = function() {
    return this.abbrevAxis + this._namespaceToString() + this.name + this._predicatesToString();
};


module.exports = State;
