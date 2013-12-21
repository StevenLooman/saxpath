var saxpath = require('../lib');
var fs = require('fs');
var sax = require('sax');


var fileStream = fs.createReadStream('../test/bookstore.xml');
var saxParser = sax.createStream(true);
var streamer = new saxpath.SaXPath(saxParser, '//book');

streamer.on('match', function(xml) {
    console.log('--- matched XML ---');
    console.log(xml);
});

fileStream.pipe(saxParser);
