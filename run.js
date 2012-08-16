#!/usr/bin/env node

var fs  = require('fs');
var sax = require('sax');
var xps = require('./lib');

var filename = 'test/bookstore.xml';

function onMatch(xml) {
    console.log(xml);
}

function main() {
    var saxParser = sax.createStream(true);
//    var streamer  = new xps.SaXPath(saxParser, '/bookstore/book');
//    var streamer  = new xps.SaXPath(saxParser, '/bookstore/book[@category="COOKING"]');
    var streamer  = new xps.SaXPath(saxParser, '//book');

    streamer.on('match', onMatch);

    var fileStream = fs.createReadStream(filename);
    fileStream.pipe(saxParser);
}

main();
