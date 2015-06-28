var util         = require('util');
var assert       = require('assert');
var XMLrecorder  = require('../lib/xml_recorder.js');

var fs      = require('fs');
var sax     = require('sax');
var saxpath = process.env.JS_COV ? require('../lib-cov') : require('../lib');


describe('Stream', function() {

  it('should be a duplex stream emitting XML chunks', function(done) {
    var fileStream = fs.createReadStream('test/bookstore.xml');
    var saxParser  = sax.createStream(true);
    var streamer   = new saxpath.Stream(saxParser, '//book');

    var list = [];
    fileStream.pipe(streamer)
    .on('data', function(data) {
      assert.ok(Buffer.isBuffer(data));
      list.push(data.toString());
    })
    .on('end', function() {
      assert.equal(list.length, 4);
      assert.notEqual(list[0].indexOf('COOKING'), -1);
      assert.notEqual(list[1].indexOf('Harry Potter'), -1);
      assert.notEqual(list[2].indexOf('Kurt Cagle'), -1);
      assert.notEqual(list[3].indexOf('39.95'), -1);
      done();
    });
  });

  it('can emit objects if the recorder is setup that way', function(done) {
    var fileStream  = fs.createReadStream('test/bookstore.xml');
    var saxParser   = sax.createStream(true);
    var recorder    = new IndexRecorder();
    var streamer    = new saxpath.Stream(saxParser, '//book', recorder, {objectMode: true});

    fileStream
    .pipe(streamer)
    .on('data', function(data) {
      assert.equal(typeof data, 'object');
      assert.ok(data.index >= 0);
      assert.ok(data.index < 4);
    })
    .on('end', function() {
      assert.equal(recorder.index, 3);
      done();
    });
  });

});

var IndexRecorder = function () {
  XMLrecorder.call(this);
  this.index = -1;
};

util.inherits(IndexRecorder, XMLrecorder);

IndexRecorder.prototype.start = function() {
  ++this.index;
};

IndexRecorder.prototype.stop = function() {
  return { index: this.index };
};
