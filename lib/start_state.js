var debug = false;
function trace(message) {
    if (debug) {
        console.log(message);
    }
}


/**
 * Start state for the state-stack
 *
 * Always matches, never unmatches
 */
function StartState() {
    this.axis = '0';
    this.enteredDepth = 0;
}


/**
 * Match this node? (always true)
 */
StartState.prototype.matches = function(node, depth) {
    trace('0 match? node: ' + node.name + ' depth: ' + depth);
    trace('0 match');
    return true;
};

/**
 * Unmatch this node? (always false)
 */
StartState.prototype.unmatches = function(tag, depth) {
    trace('0 unmatch? depth: ' + depth + ' enteredDepth: ' + this.enteredDepth);
    return false;
};


StartState.prototype.toString = function() {
    return '0';
};


module.exports = StartState;
