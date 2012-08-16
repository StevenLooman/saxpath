var debug = false;
function trace(message) {
    if (debug) {
        console.log(message);
    }
}


/**
 * XML DOM recorder
 */
function DomRecorder() {
    this.recording = false;

//    this.document = null;
//    this.currentNode = null;
}


/**
 * Start recording
 */
DomRecorder.prototype.start = function() {
    trace('start recording');

    this.recording = true;

//    this.document = new Document();
//    this.currentNode = this.document.docElement;
};

/**
 * Stop recording
 */
DomRecorder.prototype.stop = function() {
    trace('stop recording');

    this.recording = false;

//    this.emit('match', this.document);
//    this.document = null;
//    this.currentNode = null;
};

DomRecorder.prototype.isRecording = function() {
    return this.recording;
};


/**
 * Event handlers for SAX-stream
 */
DomRecorder.prototype.onOpenTag = function(node) {
    if (!this.recording) {
        return;
    }

    trace('record open tag');

//    var e = new Element(node.name);
//
//    this.currentNode.appendChild(e);
//    for (var key in node.attributes) {
//        var value = node.attributes[key];
//        e.setAttribute(key, value);
//    }
//
//    this.currentNode = e;
};

/**
 * Event handlers for SAX-stream
 */
DomRecorder.prototype.onCloseTag = function(tag) {
    if (!this.recording) {
        return;
    }

    trace('record close tag');

//    this.currentNode = this.currentNode.parentNode;
};

/**
 * Event handlers for SAX-stream
 */
DomRecorder.prototype.onText = function(text) {
    if (!this.recording) {
        return;
    }

    trace('record text');

//    var e = new TextNode(test);
//    this.currentNode.appendChild(e);
};


module.exports = DomRecorder;
