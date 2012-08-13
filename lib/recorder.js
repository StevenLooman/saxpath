function Recorder() {
//    this.document = null;
//    this.currentNode = null;
}


// XXX: move this to own class, bind to opentag, text, closetag evens and control recording with a boolean
Recorder.prototype.start = function() {
    console.log('start recording');

    this.recording = true;

//    this.document = new Document();
//    this.currentNode = this.document.docElement;
};

Recorder.prototype.stop = function() {
    console.log('stop recording');

    this.recording = false;

//    this.emit('match', this.document);
//    this.document = null;
//    this.currentNode = null;
};

Recorder.prototype.onOpenTag = function(node) {
    if (!this.recording) {
        return;
    }

    console.log('record open tag');

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

Recorder.prototype.onCloseTag = function(tag) {
    if (!this.recording) {
        return;
    }

    console.log('record close tag');

//    this.currentNode = this.currentNode.parentNode;
};

Recorder.prototype.onText = function(text) {
    if (!this.recording) {
        return;
    }

    console.log('record text');

//    var e = new TextNode(test);
//    this.currentNode.appendChild(e);
};

module.exports = Recorder;
