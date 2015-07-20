var purify = require('purify-css');

// purify(content, "purtest.css", options, callback);

var css = '.email-address{ }';

// var css = '.email-address { content: "Email address: "; }';

// purify("", css, function(output){
//   console.log('callback without options');
//   console.log(output);
// });


var result = purify("", css);
console.log(result);