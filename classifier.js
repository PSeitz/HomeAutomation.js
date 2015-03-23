var service = {};
var _=require('lodash');
var levenshtein = require('fast-levenshtein');

var synonyms = {
    play: ["abspielen", "spielen"],
    switchto: ["umschalten"],
    turnon: ["an", "einschalten", "anschalten", "aktivieren", "anknipsen", "anmachen"],
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

// console.log("apiLanguage");
// console.log(apiLanguage);

service.ClassifySentence = function(words){
    var classifiedWords = [];
    for (var i = 0; i < words.length; i++) {
        classifiedWords.push(service.ClassifyWord(words[i]));
    }

    var result = {};
    result.locations = [];
    result.targets = [];

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


function isPluginLanguageOrSynonym(word){
    word = word.toLowerCase();

    var hit = contains_lowerCase(apiLanguage, word, true);
    if (hit) return hit;

    for (var prop in synonyms) {
        if(word === prop.toLowerCase()) return prop;
        
        hit = contains_lowerCase(synonyms[prop], word, true);
        if (hit) return prop;
    }
    return undefined;
}

function contains_lowerCase(array, word, matchSubstring){
    for (var i = 0; i < array.length; i++) {
        if (matchSubstring) {
            if (word.toLowerCase().indexOf(array[i].toLowerCase()) >= 0)
                return array[i];
        }else{
            if (array[i].toLowerCase() == word.toLowerCase())
                return array[i];
        }
        
    }
    return undefined;
}

function getType(word){
    word = word.toLowerCase();
    if(contains_lowerCase(allTargets, word, true)) return "target";
    if(contains_lowerCase(allLocations, word, true)) return "location";
    if(contains_lowerCase(allCommands, word, true)) return "intention";
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

    var originalAPIWord = isPluginLanguageOrSynonym(word);
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

};



module.exports = service;