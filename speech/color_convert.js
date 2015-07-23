
// var colors = fs.readFileSync("colornames.json");

// for (var i = 0; i < colors.length; i++) {
//     var colors = colors[i];
// }

var fs = require('fs'),
    readline = require('readline');

var rd = readline.createInterface({
    input: fs.createReadStream('colorList.dat'),
    output: process.stdout,
    terminal: false
});

var colors = {};

rd.on('line', function(line) {
	line.split("\t");

	var res = line.split(/-|\t/);
    

    // colors.push({
    // 	nameEnglish: res[0].trim(),
    // 	nameGerman:  res[1].trim(),
    // 	rgb: res[2].trim(),
    // 	hex: res[3].trim()
    // });
    var nameEnglish = res[0].trim().toLowerCase();
    var nameGerman =  res[1].trim().toLowerCase();
    var rgb = res[2].trim();
    var hex = res[3].trim();


    colors[nameEnglish] = {
        rgb: rgb,
        hex: hex
    };

    colors[nameGerman] = {
        rgb: rgb,
        hex: hex
    };

    // console.log(colors[colors.length-1]);

    fs.writeFileSync("colornames.json", JSON.stringify(colors));
});