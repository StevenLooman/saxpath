SaXPath
=======
Simple XPath evaluator which runs against a SAX stream. [![Build Status](https://secure.travis-ci.org/StevenLooman/saxpath.png)](http://travis-ci.org/StevenLooman/saxpath)

Supported XPath construct as of writing are:
  - '/'-axis (child)
  - '//'-axis (self-or-descendant)
  - node name tests, including namespaces
  - all nodes selector: '*'
  - predicate test:
    - @attribute_name = "literal"

Usage
-----
Instantiate a new SaXPath object with `new saxpath.SaXPath(saxParser, xpath [, recorder])`. Then pipe a stream into it and SaXPath will emit `match` events on each XPath match. The emitted data is managed by the recorder, which by default recreates on the fly as a (XML) string from the SAX events.

Example
-------

An example of how to use this library is as follows:

```
var saxpath = require('./lib');
var fs      = require('fs');
var sax     = require('sax');

var fileStream = fs.createReadStream('test/bookstore.xml');
var saxParser  = sax.createStream(true);
var streamer   = new saxpath.SaXPath(saxParser, '//book');

streamer.on('match', function(xml) {
    console.log('--- matched XML ---');
    console.log(xml);
});

fileStream.pipe(saxParser);
```

In the example, the expression ```//book``` is evaluated against the file ```/test/bookstore.xml```. The result is that all books are returned in the function. The output of the script is:

```
--- matched XML ---
<book category="COOKING">
        <title lang="en">Everyday Italian</title>
        <author>Giada De Laurentiis</author>
        <year>2005</year>
        <price>30.00</price>
    </book>
--- matched XML ---
<book category="CHILDREN">
        <title lang="en">Harry Potter</title>
        <author>J K. Rowling</author>
        <year>2005</year>
        <price>29.99</price>
    </book>
--- matched XML ---
<book category="WEB">
        <title lang="en">XQuery Kick Start</title>
        <author>James McGovern</author>
        <author>Per Bothner</author>
        <author>Kurt Cagle</author>
        <author>James Linn</author>
        <author>Vaidyanathan Nagarajan</author>
        <year>2003</year>
        <price>49.99</price>
    </book>
--- matched XML ---
<book category="WEB">
        <title lang="en">Learning XML</title>
        <author>Erik T. Ray</author>
        <year>2003</year>
        <price>39.95</price>
    </book>
```

Check out the `examples` directory for usage examples.

Inner workings
--------------
A state machine is built which the SAX-events are tested against. If an event matches, the state machine progresses.

For self-or-descendant-nodes, the state machine is forked and earch fork (including the parent) is tested against the SAX-nodes. This ensures all nodes are matched. See `test/saxpath.js` and `test/inception.xml` for an example.

Each SAX event emitted by the `saxParser` is transmitted to a `recorder`, which is in charge of handling the data if it matches the XPath. Check `examples/custom-recorder.js` to see how to create a custom recorder.
