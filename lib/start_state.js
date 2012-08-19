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
    this.id = new Date().getTime() + '-' + Math.round(Math.random() * 65535);
}


/**
 * Match this node? (always true)
 */
StartState.prototype.matches = function(node, depth) {
    this.enteredDepth = depth;

    trace('0 match? node: ' + node.name + ' depth: ' + depth);
    trace('0 match');
    return true;
};

/**
 * Unmatch this node? (always false)
 */
StartState.prototype.unmatches = function(tag, depth) {
    trace('0 unmatch? depth: ' + depth + ' enteredDepth: ' + this.enteredDepth);
    return this.enteredDepth >= depth;
};


StartState.prototype.toString = function() {
    return '0';
};


module.exports = StartState;
