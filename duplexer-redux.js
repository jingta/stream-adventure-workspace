var duplexer = require('duplexer');
var through = require('through');


var countryCounts = {};

module.exports = function (counter) {
  // return duplex stream to capture countries and pass through counter
  //counter is readable stream of json objects.

  var writeCount = function(row) {
    var country = row.country;
    countryCounts[country] =
      countryCounts[country] ? countryCounts[country] + 1 : 1;
  };
  var setCounts = function () {
    counter.setCounts(countryCounts);
  };

  var writer = through(writeCount, setCounts);
  return duplexer(writer, counter);

}
/*
In this example, you will be given a readable stream, `counter`, as the first
argument to your program:

    module.exports = function (counter) {
        // return a duplex stream to capture countries on the writable side
        // and pass through `counter` on the readable side
    };

Return a duplex stream with the `counter` as the readable side. You will be
written objects with a 2-character `country` field as input, such as these:

    {"short":"OH","name":"Ohio","country":"US"}
    {"name":"West Lothian","country":"GB","region":"Scotland"}
    {"short":"NSW","name":"New South Wales","country":"AU"}

Create an object to keep a count of all the countries in the input. Once the
input ends, call `counter.setCounts()` with your country counts.

The `duplexer` module will again be very handy in this example.

If you use duplexer, make sure to `npm install duplexer` in the directory where
your solution file is located.

To verify your program, run: `stream-adventure verify program.js`.
*/
