function TapeRecorder() {
    this.box = [];  // we got a box full of tapes
    this.deck = {}; // current tape in the deck
}


TapeRecorder.prototype.start = function(state) {
    if (this.deck[state.id]) {
        throw new Error("Tape is already recording");
    }

    var tape = [];
    tape.push({ start: true });

    this.deck[state.id] = tape;
};

TapeRecorder.prototype.stop = function(state) {
    var tape = this.deck[state.id];

    tape.push({ stop: true });
    this.box.push(tape);

    delete this.deck[state.id];
};

TapeRecorder.prototype.onOpenTag = function(node) {
    var tape;
    var id;
    for (id in this.deck) {
        tape = this.deck[id];
        tape.push({ openTag: node });
    }
};

TapeRecorder.prototype.onCloseTag = function(tag) {
    var tape;
    var id;
    for (id in this.deck) {
        tape = this.deck[id];
        tape.push({ closeTag: tag });
    }
};

TapeRecorder.prototype.onText = function (text) {
    var tape;
    var id;
    for (id in this.deck) {
        tape = this.deck[id];
        tape.push({ text: text });
    }
};

TapeRecorder.prototype.onOpenCDATA = function() {
    var tape;
    var id;
    for (id in this.deck) {
        tape = this.deck[id];
        tape.push({ openCData: true });
    }
};

TapeRecorder.prototype.onCDATA = function (cdata) {
    var tape;
    var id;
    for (id in this.deck) {
        tape = this.deck[id];
        tape.push({ cdata: cdata });
    }
};

TapeRecorder.prototype.onCloseCDATA = function() {
    var tape;
    var id;
    for (id in this.deck) {
        tape = this.deck[id];
        tape.push({ closeCData: true });
    }
};


module.exports = TapeRecorder;
