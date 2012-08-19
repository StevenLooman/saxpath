var debug = false;
function trace(message) {
    if (debug) {
        console.log(message);
    }
}


/**
 * XML DOM recorder
 */
function XmlRecorder() {
    this.recording = false;
}


/**
 * Start recording
 */
XmlRecorder.prototype.start = function(state) {
    trace('start recording');

    this.recording = true;
    this.str = '';
};

/**
 * Stop recording
 */
XmlRecorder.prototype.stop = function(state) {
    trace('stop recording');

    this.recording = false;
    return this.str;
};

/**
 * Event handlers for SAX-stream
 */
XmlRecorder.prototype.onOpenTag = function(node) {
    if (!this.recording) {
        return;
    }

    trace('record open tag');

    this.str += '<' + node.name + '>';
};

/**
 * Event handlers for SAX-stream
 */
XmlRecorder.prototype.onCloseTag = function(tag) {
    if (!this.recording) {
        return;
    }

    trace('record close tag');

    this.str += '</' + tag + '>';
};

/**
 * Event handlers for SAX-stream
 */
XmlRecorder.prototype.onText = function(text) {
    if (!this.recording) {
        return;
    }

    trace('record text');

    this.str += text;
};


module.exports = XmlRecorder;
