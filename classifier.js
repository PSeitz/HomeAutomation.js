var service = {};
var _=require('lodash');
var levenshtein = require('fast-levenshtein');

var synonyms = {
    play: ["abspielen", "spielen"],
    switchto: ["umschalten"],
    turnon: ["an", "anschalten", "aktivieren", "anknipsen", "anmachen"],
    turnoff: ["aus" , "abschalten", "ausmachen", "ausschalten", "turn off", "ausknipsen", "eliminieren",
                "liquidieren", "neutralisieren", "terminieren", "スイッチを切る"],
    increase: ["erhöhen", "anheben", "lauter"],
    decrease: ["leiser", "absenken", "reduzieren"],
    //targets
    fernsehen:["fernseher", "fernsehen", "tv"],
    licht:["lichter", "lights"],
    receiver:["Verstärker"]
};

var configLoader = require('./configloader');

// build plugin language
var allTargets = configLoader.getAllTargets();
var allLocations = configLoader.getAllLocations();
var allCommands = configLoader.getAllCommands();

var apiLanguage = allTargets.concat(allLocations).concat(allCommands);

console.log(apiLanguage);

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


function isSynonymOfAPIList(word){
    word = word.toLowerCase();
    for (var prop in synonyms) {
        if(word === prop.toLowerCase() ){
            return prop;
        }
        var aliases = synonyms[prop];
        for (var i = 0; i < aliases.length; i++) {
            if( word === aliases[i].toLowerCase() ){
                return aliases[i];
            }
        }
    }
    return undefined;
}

function contains_lowerCase(array, word){
    for (var i = 0; i < array.length; i++) {
        if (array[i].toLowerCase() == word.toLowerCase()) {
            return true;
        }
    }
}

function getType(word){
    word = word.toLowerCase();
    if(contains_lowerCase(allTargets, word)) return "target";
    if(contains_lowerCase(allLocations, word)) return "location";
    if(contains_lowerCase(allCommands, word)) return "intention";
    console.warn("Oh no not found");
}

/*
*   {
*       type: "intention",
*       value: "turnon"  
*   }
*/
service.ClassifyWord = function(word){
    word = word.toLowerCase();


    // Check synonyms
    var originalAPIWord = isSynonymOfAPIList(word);
    if(originalAPIWord){
        return {
            type:  getType(originalAPIWord),
            value: originalAPIWord
        };
    }else{
        return {
            type: "unknown"
        };

    }

    //Location
    // if(containsLocation(word)){
    //     return {
    //         type: "location",
    //         value: word
    //     };
    // }

    // //Actions
    // for (var prop in synonyms) {
    //     var synon = synonyms[prop];
    //     for (var i = 0; i < synon.length; i++) {
    //         if(word.indexOf(synon[i].toLowerCase()) >= 0 ){
    //             return {
    //                 type: "intention",
    //                 value: prop
    //             };
    //         }
    //     }
    // }

    // //Targets
    // for (var j = 0; j < allTargets.length; j++) {
    //     if(word.indexOf(allTargets[j].toLowerCase()) >= 0 ){
    //         return {
    //             type: "target",
    //             value: allTargets[j]
    //         };
    //     }
    // }

    // //Unknown
    // return {
    //     type: "unknown"
    // };


};



module.exports = service;