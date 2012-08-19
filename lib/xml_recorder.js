function XmlRecorder() {
    this.streams = {};
}


XmlRecorder.prototype.start = function(state) {
    this.streams[state.id] = '';
};

XmlRecorder.prototype.stop = function(state) {
    var stream = this.streams[state.id];

    delete this.streams[state.id];

    return stream;
};

XmlRecorder.prototype.onOpenTag = function(node) {
    var id;
    for (id in this.streams) {
        this.streams[id] += '<' + node.name + '>';
    }
};

XmlRecorder.prototype.onCloseTag = function(tag) {
    var id;
    for (id in this.streams) {
        this.streams[id] += '</' + tag + '>';
    }
};

XmlRecorder.prototype.onText = function (text) {
    var id;
    for (id in this.streams) {
        this.streams[id] += text;
    }
};


module.exports = XmlRecorder;
