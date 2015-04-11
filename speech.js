var plugins = require('./plugins');
var configLoader = require('./configloader');
var classifier = require('./classifier');
var config = configLoader.get("Speech");
var levenshtein = require('fast-levenshtein');
var _ = require('lodash');

for (var i = 0; i < config.length; i++) {
    for (var j = 0; j < config[i].match.length; j++) {
        config[i].match[j] = config[i].match[j].toLowerCase();
    }
}



// var distance = levenshtein.get('Super', 'SUPER');   // 1
// console.log("distance " +distance);

var service = {};

function activateServicesByName(services){
    
    for (var i = 0; i < services.length; i++) {
        var serviceName = services[i];
        var service = plugins.findServiceByName(serviceName);
        if (service) {
            service.action();
        }else{
            console.log("Service not found " + serviceName);
        }
    }
}

//e.g. "Das ist ein Test"
service.handleSpeech = function(speech){
    speech = speech.toLowerCase();
    var words = speech.split(" ");

    for (var i = 0; i < config.length; i++) {
        for (var j = 0; j < config[i].match.length; j++) {
            var match = config[i].match[j];
            var distance = levenshtein.get(speech.toLowerCase(), match.toLowerCase());
            if (distance <= 1) {
                // plugins.findServiceByName(config[i].services).action();
                activateServicesByName(config[i].services);
                return;
            }
            // if (match.indexOf(speech) !== -1 || speech.indexOf(match) !== -1) {
            //  plugins.findServiceByName(config[i].action.service).action();
            //  return;
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
        //  service.action();
        //  return;
        // }
    }

    advancedMeaningRecognition(speech);

    console.log("No match found for" + speech);

};


function getAction(words, index){
    for (var i = 0; i < words.length; i++) {
        var distance = levenshtein.get(word.toLowerCase(), words[i].toLowerCase());
        if (distance <= 1) {
            return words[i];
        }
    }
}

// Intentions:
//      {
//          action: anschalten, ausschalten, erhöhen, verringern
//          targets: Fernseher und Licht/er
//          locations: Wohnzimmer / Alle
//      }

//      {
//          action: machen
//          targets: Licht/er
//          locations: Wohnzimmer
//          properties: grün
//      }

//      {
//          action: lauter machen
//          targets: Verstärker
//          properties: viel
//      }

function isSynonym(word1, word2){
    word1 = word1.toLowerCase();
    word2 = word2.toLowerCase();
    if (word1 == word2) {
        return true;
    }
    return false;
}

function advancedMeaningRecognition(sentence){
    
    var words = sentence.split(" ");
    var classifiedWords = [];
    var allMod = false;

    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        classifiedWords.push(classifier.ClassifyWord(words[i]));
        if (isSynonym(word, "alle")) {
            allMod = true;
        }
    }

    var result = {};
    result.locations = [];
    result.targets = [];
    result.adjectives = [];

    for (i = 0; i < classifiedWords.length; i++) {
        var classifiedWord = classifiedWords[i];
        if (classifiedWord.type == "intention") {
            result.action = classifiedWord.value;
        }
        if (classifiedWord.type == "target") {
            result.targets.push(classifiedWord.value);
        }
        if (classifiedWord.type == "location") {
            result.locations.push(classifiedWord.value);
        }
        if (classifiedWord.type == "adjective") {
            result.adjectives.push(classifiedWord.value);
        }
    }

    console.log("targets " + result.targets);
    console.log("action " +result.action);
    console.log("locations "+result.locations);

    for (i = 0; i < result.targets.length; i++) {
        var plugin = plugins.getPluginForTarget(result.targets[i]);
        var devices = plugins.getPluginDevicesByLocation(result.locations, plugin);
        if (devices.length === 0 && allMod) {
            devices = plugins.getAllPluginDevices(plugin);
        }
        var command = {
            target:result.targets[i],
            action: result.action,
            locations:result.locations,
            devices: devices
        };
        plugin.commandApi(command);
    }

    //If action applies to only one target
    if (_.isEmpty(result.targets)) {
        
    }

}


// setTimeout(function(){
//     // advancedMeaningRecognition("Im Arbeitszimmer und im Flur Licht ausmachen");
//     advancedMeaningRecognition("Licht aus im Arbeitszimmer");
// }, 3000);


module.exports = service;