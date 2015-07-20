// build plugin parser
var fs = require("fs");
var jison = require("jison");

var bnf = fs.readFileSync("grammar.jison", "utf8");
var parser = new jison.Parser(bnf);


console.log(parser.parse("10 - 8 - 50 PROZENT"));

console.log(parser.parse("Licht auf 50 Prozent"));