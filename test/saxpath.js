var assert = require('assert');
var TestRecorder = require('./recorder');

var fs  = require('fs');
var sax = require('sax');
var xps = require('..');


describe('SaXPath', function() {
    it('should match /bookstore/book', function(done) {
        var fileStream = fs.createReadStream('test/bookstore.xml');
        var recorder   = new TestRecorder();
        var saxParser  = sax.createStream(true);
        var streamer   = new xps.SaXPath(saxParser, '/bookstore/book', recorder);

        saxParser.on('end', testNodesRecorded);
        fileStream.pipe(saxParser);

        function testNodesRecorded() {
            assert.ok(recorder.tape.length > 0);
            assert.equal(recorder.tape[0].name, 'book');
            done();
        }
    });

    it('should match /bookstore/book[@category="COOKING"]', function(done) {
        var fileStream = fs.createReadStream('test/bookstore.xml');
        var recorder   = new TestRecorder();
        var saxParser  = sax.createStream(true);
        var streamer   = new xps.SaXPath(saxParser, '/bookstore/book[@category="COOKING"]', recorder);

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
        var fileStream = fs.createReadStream('test/bookstore.xml');
        var recorder   = new TestRecorder();
        var saxParser  = sax.createStream(true);
        var streamer   = new xps.SaXPath(saxParser, '/bookstore/title', recorder);

        saxParser.on('end', testNodesRecorded);
        fileStream.pipe(saxParser);

        function testNodesRecorded() {
            assert.ok(recorder.tape.length === 0);
            done();
        }
    });

    it('should match //book', function(done) {
        var fileStream = fs.createReadStream('test/bookstore.xml');
        var recorder   = new TestRecorder();
        var saxParser  = sax.createStream(true);
        var streamer   = new xps.SaXPath(saxParser, '//book', recorder);
        console.log(streamer);

        saxParser.on('end', testNodesRecorded);
        fileStream.pipe(saxParser);

        function testNodesRecorded() {
            assert.ok(recorder.tape.length > 0);
            assert.equal(recorder.tape[0].name, 'book');
            done();
        }
    });

    it('should match //book[@category="COOKING"]', function(done) {
        var fileStream = fs.createReadStream('test/bookstore.xml');
        var recorder   = new TestRecorder();
        var saxParser  = sax.createStream(true);
        var streamer   = new xps.SaXPath(saxParser, '//book[@category="COOKING"]', recorder);
        console.log(streamer);

        saxParser.on('end', testNodesRecorded);
        fileStream.pipe(saxParser);

        function testNodesRecorded() {
            assert.ok(recorder.tape.length > 0);
            assert.equal(recorder.tape[0].name, 'book');
            done();
        }
    });
});
