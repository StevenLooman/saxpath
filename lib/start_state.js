var debug = true;
function trace(message) {
    if (debug) {
        console.log(message);
    }
}


function StartState() {
    this.axis = '0';
    this.enteredDepth = 0;
}


StartState.prototype.matches = function(node, depth) {
    trace('0 match? node: ' + node.name + ' depth: ' + depth);
    trace('0 match');
    return true;
};

StartState.prototype.unmatches = function(tag, depth) {
    trace('0 unmatch? depth: ' + depth + ' enteredDepth: ' + this.enteredDepth);
    return false;
};


StartState.prototype.toString = function() {
    return '0';
};


module.exports = StartState;
