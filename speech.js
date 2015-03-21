var plugins = require('./plugins');
var config = require('./configloader')("Speech");
var levenshtein = require('fast-levenshtein');

for (var i = 0; i < config.length; i++) {
	for (var j = 0; j < config[i].match.length; j++) {
		config[i].match[j] = config[i].match[j].toLowerCase();
	}
}


// var distance = levenshtein.get('Super', 'SUPER');   // 1
// console.log("distance " +distance);


var service = {};

//e.g. "Das ist ein Test"
service.handleSpeech = function(speech){
	speech = speech.toLowerCase();
	var words = speech.split(" ");

	for (var i = 0; i < config.length; i++) {
		for (var j = 0; j < config[i].match.length; j++) {
			var match = config[i].match[j];
			var distance = levenshtein.get(speech.toLowerCase(), match.toLowerCase());   // 1
			if (distance <= 1) {
				plugins.findServiceByName(config[i].action.service).action();
				return;
			}
			// if (match.indexOf(speech) !== -1 || speech.indexOf(match) !== -1) {
			// 	plugins.findServiceByName(config[i].action.service).action();
			// 	return;
			// }
		}
	}

	var services = plugins.getAllServices();
	for (i = 0; i < services.length; i++) {
		var service = services[i];
		if (levenshtein.get(service.name.toLowerCase(), speech.toLowerCase()) <= 1) {
			service.action();
			return;
		}
		// if (service.name.toLowerCase().indexOf(speech) !== -1 || speech.indexOf(service.name.toLowerCase()) !== -1) {
		// 	service.action();
		// 	return;
		// }
	}
	console.log("No match found for" + speech);

};

module.exports = service;