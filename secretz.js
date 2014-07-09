var zlib = require('zlib'),
  crypto = require('crypto'),
  tar = require('tar'),
  through = require('through'),
  fs = require('fs');

var cipher = process.argv[2];
var pass = process.argv[3];

var tarParser = tar.Parse();
tarParser.on('entry', function(entry) {
  if (entry.type === 'File') {
    var md5hash = crypto.createHash('md5', { encoding: 'hex' });
  //  var reader = fs.createReadStream(__dirname + '/' + entry.path);
    entry
      .pipe(md5hash)
      .pipe(through(function (data) {
          this.queue(data + ' ' + entry.path + '\n');
        }))
      .pipe(process.stdout);
  }
});

process.stdin
  .pipe(crypto.createDecipher(cipher, pass))
  .pipe(zlib.createGunzip())
  .pipe(tarParser);

/*
An encrypted, gzipped tar file will be piped in on process.stdin. To beat this
challenge, for each file in the tar input, print a hex-encoded md5 hash of the
file contents followed by a single space followed by the filename, then a
newline.

You will receive the cipher name as process.argv[2] and the cipher passphrase as
process.argv[3]. You can pass these arguments directly through to
`crypto.createDecipher()`.

The built-in zlib library you get when you `require('zlib')` has a
`zlib.createGunzip()` that returns a stream for gunzipping.

The `tar` module from npm has a `tar.Parse()` function that emits `'entry'`
events for each file in the tar input. Each `entry` object is a readable stream
of the file contents from the archive and:

`entry.type` is the kind of file ('File', 'Directory', etc)
`entry.path` is the file path

Using the tar module looks like:

    var tar = require('tar');
    var parser = tar.Parse();
    parser.on('entry', function (e) {
        console.dir(e);
    });
    var fs = require('fs');
    fs.createReadStream('file.tar').pipe(parser);

Use `crypto.createHash('md5', { encoding: 'hex' })` to generate a stream that
outputs a hex md5 hash for the content written to it.

Make sure to `npm install tar through` in the directory where your solution
file lives.

To verify your program, run: `stream-adventure verify program.js`.
*/
