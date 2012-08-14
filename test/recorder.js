function TestRecorder() {
    this.tape = [];

    this.isRecording = false;
}


TestRecorder.prototype.start = function() {
    this.isRecording = true;
};

TestRecorder.prototype.stop = function() {
    this.isRecording = false;
};

TestRecorder.prototype.onOpenTag = function(node) {
    if (this.isRecording) {
        this.tape.push(node);
    }
};

TestRecorder.prototype.onCloseTag = function(tag) {
    if (this.isRecording) {
        this.tape.push(tag);
    }
};

TestRecorder.prototype.onText = function (text) {
    if (this.isRecording) {
        this.tape.push(text);
    }
};


module.exports = TestRecorder;
