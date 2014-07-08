var split = require('split');
var through = require('through');

var toggle = true;

var tr = through(function (line) {
  var str = line.toString();

  toggle = !toggle;
  if (toggle) {
    str = str.toUpperCase()
  } else {
    str = str.toLowerCase()
  }
  //this.queue(str);
  console.log(str);
});

process.stdin
  .pipe(split())
  .pipe(tr);
//  .pipe(process.stdout);
