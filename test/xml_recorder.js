var fs      = require('fs');
var sax     = require('sax');
var assert  = require('assert');

var saxpath = process.env.JS_COV ? require('../lib-cov') : require('../lib');


describe('XmlRecorder', function() {
    it('should re-escape values', function(done) {
        var fileStream = fs.createReadStream('test/data/re-escape.xml');
        var saxParser  = sax.createStream(true);
        var streamer   = new saxpath.SaXPath(saxParser, '//node');

        streamer.on('match', onMatch);
        streamer.on('end', onEnd);

        // store matched XML instead of finishing test/calling done(),
        // otherwise sax parser will complain about not ending the root tag
        var xml = '';
        function onMatch(matchedXml) {
            xml = matchedXml;
        }

        function onEnd() {
            assert.equal(xml, '<node attr="&lt;test&gt;"></node>');
            done();
        }

        fileStream.pipe(saxParser);
    });
});
