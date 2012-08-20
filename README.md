SaXPath
=======
Simple XPath evaluator which runs against a SAX stream. [![Build Status](https://secure.travis-ci.org/StevenLooman/saxpath.png)](http://travis-ci.org/StevenLooman/saxpath)

Supported XPath construct as of writing are:
  - '/'-axis (child)
  - '//'-axis (self-or-descendant)
  - node name tests, including namespaces
  - predicate test (@<attribute_name> = "<literal>")

Inner workings
--------------
A state machine is built which the SAX-nodes are tested against. If a node matches, the state machine progresses.

For self-or-descendant-nodes, the state machine is forked and earch fork (including the parent) is tested against the SAX-nodes. This ensures all nodes are matched. See test/saxpath.js and test/inception.xml for an example.
