var colorToHue = require("./colorToHue");
var colors = require("./colors");

var rgb ={
	r:0.5,
	b:0.5,
	g:0.5
};
console.log(colorToHue.rgbToHue(rgb));



var rgb ={
	r:0.1,
	b:1.0,
	g:0.1
};
console.log(colorToHue.rgbToHue(rgb));
console.log(colors);

console.log(colorToHue.rgbToHue(rgb));

console.log(colorToHue.hexStringToXyBri(colors.getColorForName("grün").hex));

