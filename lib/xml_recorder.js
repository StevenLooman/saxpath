function XmlRecorder() {
    this.streams = {};
}

function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
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
    var attribute;
    for (id in this.streams) {
        if (this.streams.hasOwnProperty(id)) {
            this.streams[id] += '<' + node.name;
            for (attribute in node.attributes) {
                this.streams[id] += ' ' + attribute;
                this.streams[id] += '="' + escapeXml(node.attributes[attribute]) + '"';
            }
            this.streams[id] += '>';
        }
    }
};

XmlRecorder.prototype.onCloseTag = function(tag) {
    var id;
    for (id in this.streams) {
        if (this.streams.hasOwnProperty(id)) {
            this.streams[id] += '</' + tag + '>';
        }
    }
};

XmlRecorder.prototype.onText = function (text) {
    var id;
    for (id in this.streams) {
        if (this.streams.hasOwnProperty(id)) {
            this.streams[id] += text;
        }
    }
};

XmlRecorder.prototype.onOpenCDATA = function () {
    this.onText('<![CDATA[');
};

XmlRecorder.prototype.onCDATA = function (cdata) {
    this.onText(cdata);
};

XmlRecorder.prototype.onCloseCDATA = function () {
    this.onText(']]>');
};


module.exports = XmlRecorder;
