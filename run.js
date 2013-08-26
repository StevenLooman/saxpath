#!/usr/bin/env node

var fs     = require('fs');
var sax    = require('sax');
var xps    = require('./lib');

//var filename = 'test/bookstore.xml';
var filename = 'test/inception.xml';

function onMatch(xml) {
    console.log('=== on match');
    console.log(xml);
}

function main() {
    var saxParser = sax.createStream(true);

//    var streamer  = new xps.SaXPath(saxParser, '/bookstore/book');
//    var streamer  = new xps.SaXPath(saxParser, '/bookstore/book[@category="COOKING"]');
//    var streamer  = new xps.SaXPath(saxParser, '//book');
    var streamer  = new xps.SaXPath(saxParser, '//node');

    streamer.on('match', onMatch);

    var fileStream = fs.createReadStream(filename);
    fileStream.pipe(saxParser);
}

main();
