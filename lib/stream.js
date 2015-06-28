var stream = require('stream');
var duplexify = require('duplexify');
var SaXPath = require('./saxpath');

function createReadable(streamer, args) {
  var readable = new stream.Readable(args);
  streamer.on('match', function(chunk) {
    readable.push(chunk);
  });
  streamer.on('end', function() {
    readable.push(null);
  });
  readable._read = function(n) {
  };
  return readable;
}

module.exports = function SaXPathStream(saxParser, xpath, recorder, streamArgs) {
  var streamer = new SaXPath(saxParser, xpath, recorder);
  var readable = createReadable(streamer, streamArgs);
  return duplexify(saxParser, readable, streamArgs);
};
