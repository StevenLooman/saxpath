function TapeRecorder() {
    this.box = [];
    this.tape = null;

    this.tapeOn = false;
}


TapeRecorder.prototype.start = function(state) {
    if (this.tapeOn) {
        throw new Error("Tape is already on");
    }

    this.tapeOn = true;

    this.tape = [];
    this.tape.push({ start: true });
};

TapeRecorder.prototype.stop = function(state) {
    this.tapeOn = false;

    this.tape.push({ stop: true });
    this.box.push(this.tape);
    this.tape = null;
};

TapeRecorder.prototype.onOpenTag = function(node) {
    if (this.tapeOn) {
        this.tape.push({ openTag: node });
    }
};

TapeRecorder.prototype.onCloseTag = function(tag) {
    if (this.tapeOn) {
        this.tape.push({ closeTag: tag });
    }
};

TapeRecorder.prototype.onText = function (text) {
    if (this.tapeOn) {
        this.tape.push({ text: text });
    }
};


module.exports = TapeRecorder;
