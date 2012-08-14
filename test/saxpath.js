var assert = require('assert');
var TestRecorder = require('./recorder');

var fs  = require('fs');
var sax = require('sax');
var xps = require('..');


describe('SaXPath', function() {
    it('should match /bookstore/book', function(done) {
        var recorder = new TestRecorder();
        var saxParser = sax.createStream(true);
        var streamer  = new xps.SaXPath(saxParser, '/bookstore/book', recorder);
        var fileStream = fs.createReadStream('test/bookstore.xml');

        saxParser.on('end', testNodesRecorded);
        fileStream.pipe(saxParser);

        function testNodesRecorded() {
            assert.ok(recorder.tape.length > 0);
            assert.equal(recorder.tape[0].name, 'book');
            done();
        }
    });

    it('should match /bookstore/book[@category="COOKING"]', function(done) {
        var recorder = new TestRecorder();
        var saxParser = sax.createStream(true);
        var streamer  = new xps.SaXPath(saxParser, '/bookstore/book[@category="COOKING"]', recorder);
        var fileStream = fs.createReadStream('test/bookstore.xml');

        saxParser.on('end', testNodesRecorded);
        fileStream.pipe(saxParser);

        function testNodesRecorded() {
            assert.ok(recorder.tape.length > 0);
            assert.equal(recorder.tape[0].name, 'book');
            assert.deepEqual(recorder.tape[0].attributes, { category: 'COOKING' });
            done();
        }
    });

    it('should not match /bookstore/title', function(done) {
        var recorder = new TestRecorder();
        var saxParser = sax.createStream(true);
        var streamer  = new xps.SaXPath(saxParser, '/bookstore/title', recorder);
        var fileStream = fs.createReadStream('test/bookstore.xml');

        saxParser.on('end', testNodesRecorded);
        fileStream.pipe(saxParser);

        function testNodesRecorded() {
            console.log(recorder.tape);
            assert.ok(recorder.tape.length === 0);
            done();
        }
    });
});
