var saxpath = require('../lib');
var fs = require('fs');
var sax = require('sax');
var util = require('util');
var XMLrecorder = require('../lib/xml_recorder.js');


// This custom recorder changes all text to lower case
// All available methods can be seen in lib/xml_recorder.js
var MyRecorder = function () {
  XMLrecorder.call(this);
};
util.inherits(MyRecorder, XMLrecorder);

MyRecorder.prototype.onText = function(text) {
  text = text.toLowerCase();
  MyRecorder.super_.prototype.onText.bind(this)(text);
};


var fileStream = fs.createReadStream('../test/bookstore.xml');
var saxParser = sax.createStream(true);
var streamer = new saxpath.SaXPath(saxParser, '//book', new MyRecorder());

streamer.on('match', function(xml) {
    console.log('--- matched XML ---');
    console.log(xml);
});

fileStream.pipe(saxParser);