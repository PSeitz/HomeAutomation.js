var plugins = require('./plugins');
var configLoader = require('./configloader');
var classifier = require('./classifier');
var say_service = require('./say.js');
var config = configLoader.get("Speech");
var levenshtein = require('fast-levenshtein');
var _ = require('lodash');
var germansynonyms = require('germansynonyms');

for (var i = 0; i < config.length; i++) {
    for (var j = 0; j < config[i].match.length; j++) {
        config[i].match[j] = config[i].match[j].toLowerCase();
    }
}
// var distance = levenshtein.get('Super', 'SUPER');   // 1
// console.log("distance " +distance);
// say_service.say("Supiii - juhu");

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


    // 1: Preconfigured Speech action
    for (var i = 0; i < config.length; i++) {
        for (var j = 0; j < config[i].match.length; j++) {
            var match = config[i].match[j];
            var distance = levenshtein.get(speech.toLowerCase(), match.toLowerCase());
            if (distance <= 1) {
                activateServicesByName(config[i].services);
                say_service.say(config[i].services);
                return;
            }
        }
    }

    // 2: Services which match the speech string
    var services = plugins.getAllServices();
    for (i = 0; i < services.length; i++) {
        var plugin_service = services[i];
        if (levenshtein.get(plugin_service.name.toLowerCase(), speech.toLowerCase()) <= 1) {
            plugin_service.action();
            say_service.say(plugin_service.name);
            return;
        }
    }

    // 3: That's the real thang
    service.advancedMeaningRecognition(speech);

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

service.semanticResult = function(speech){

    var words = speech.split(" ");  // Only speech with space supported

    return classifier.getIntentions(words);

};

service.advancedMeaningRecognition = function(speech){
    
    var allMod = false;

    var intentions = service.semanticResult(speech);

    var say = '';

    for (var j = 0; j < intentions.length; j++) {
        var intent = intentions[j];
        for (i = 0; i < intent.targets.length; i++) {
            var plugin = plugins.getPluginForTarget(intent.targets[i]);
            var devices = plugins.getPluginDevicesByLocation(intent.locations, plugin);
            if (devices.length === 0 ) {
                devices = plugins.getAllPluginDevices(plugin);
            }
            intent.devices = devices;
            var tmp = plugin.commandApi(intent);
            if (tmp) say += tmp; 
            
        }

    }

    if (say) {
        germansynonyms.getRandomSynonymSentence(say).then(function (result) {
            console.log("Saying:"+ result);
            say_service.say(result);
        })
        // say_service.say(say); // :)
    }

};


// setTimeout(function(){
//     // serice.advancedMeaningRecognition("Im Arbeitszimmer und im Flur Licht ausmachen");
//     // service.advancedMeaningRecognition("Licht an im Arbeitszimmer");
//     // service.advancedMeaningRecognition("Helligkeit auf 0 Prozent");
//     // service.advancedMeaningRecognition("Helligkeit erhöhen");

//     service.advancedMeaningRecognition("Fernseher ausschalten");
// }, 3000);


module.exports = service;