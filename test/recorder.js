function TestRecorder() {
    this.tape = [];

    this.tapeOn = false;
}


TestRecorder.prototype.start = function() {
    this.tapeOn = true;
};

TestRecorder.prototype.stop = function() {
    this.tapeOn = false;
};

TestRecorder.prototype.isRecording = function() {
    return this.tapeOn;
};

TestRecorder.prototype.onOpenTag = function(node) {
    if (this.tapeOn) {
        this.tape.push(node);
    }
};

TestRecorder.prototype.onCloseTag = function(tag) {
    if (this.tapeOn) {
        this.tape.push(tag);
    }
};

TestRecorder.prototype.onText = function (text) {
    if (this.tapeOn) {
        this.tape.push(text);
    }
};


module.exports = TestRecorder;
