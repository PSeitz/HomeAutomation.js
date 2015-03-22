var service = {};
var _=require('lodash');
var levenshtein = require('fast-levenshtein');

var verbs = {
    play: ["abspielen", "spielen"],
    switchto: ["umschalten"],
    turnon: ["an", "anschalten", "aktivieren", "anknipsen", "anmachen"],
    turnoff: ["aus" , "abschalten", "ausmachen", "ausschalten", "turn off", "ausknipsen", "eliminieren", 
                "liquidieren", "neutralisieren", "terminieren", "スイッチを切る"],
    increase: ["erhöhen", "anheben", "lauter"],
    decrease: ["leiser", "absenken", "reduzieren"]
};


var configLoader = require('./configloader');
var allTargets = configLoader.getTargets();
console.log(allTargets);


var allLocations = configLoader.get("Rooms");
function containsLocation(word){
    word = word.toLowerCase();
    for (var i = 0; i < allLocations.length; i++) {
        var location = allLocations[i];
        if (word.indexOf(location.toLowerCase()) >= 0) {
            return location;
        }
    }
    return undefined;
}

service.ClassifySentence = function(words){
    var classifiedWords = [];
    for (var i = 0; i < words.length; i++) {
        classifiedWords.push(service.ClassifyWord(words[i]));
    }

    var result = {};
    result.locations = [];
    // result.action;
    result.targets = [];
    // result.properties;

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
    }

    return result;
};

/*
*   {
*       type: "intention",
*       value: "turnon"  
*   }
*/
service.ClassifyWord = function(word){
    word = word.toLowerCase();

    //Location
    if(containsLocation(word)){
        return {
            type: "location", 
            value: word
        };
    }

    //Actions
    for (var prop in verbs) {
        var synon = verbs[prop];
        for (var i = 0; i < synon.length; i++) {
            if(word.indexOf(synon[i].toLowerCase()) >= 0 ){
                return {
                    type: "intention", 
                    value: prop
                };
            }
        }
    }

    //Targets
    for (var j = 0; j < allTargets.length; j++) {
        if(word.indexOf(allTargets[j].toLowerCase()) >= 0 ){
            return {
                type: "target", 
                value: allTargets[j]
            };
        }
    }

    //Unknown
    return {
        type: "unknown"
    };


};





module.exports = service;