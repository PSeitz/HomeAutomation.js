var service = {};
var _=require('lodash');
var levenshtein = require('fast-levenshtein');
var germansynonyms = require('germansynonyms');
var cld = require('cld');

var configLoader = require('./configloader');

// build plugin language
var allTargets = configLoader.getAllTargets();
var allLocations = configLoader.getAllLocations();
var allCommands = configLoader.getAllCommands();
var synonym_hints = configLoader.get("SynonymHints");

var langs = configLoader.get("Languages");


// build plugin parser
// var fs = require("fs");
// var jison = require("jison");

// var bnf = fs.readFileSync("grammar.jison", "utf8");
// var parser = new jison.Parser(bnf);


service.ClassifySentence = function(sentence){
    var words = sentence.split(" ");

    // cld.detect(string, function(err, result) {
    //     console.log(result);
    // });

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

function reduceSynonymToAPIName(word){
    if (!word) return word;
    for (var prop in synonym_hints) {
        if(word === prop.toLowerCase()) return prop;
        
        hit = contains_lowerCase(synonym_hints[prop], word, true);
        if (hit) return prop;
    }
    return word;
}

function buildLanguageWithHints(){
    var apiLanguage = allTargets.concat(allLocations).concat(allCommands);
    for (var name in synonym_hints) { // adding synonym_hints
        var hint = synonym_hints[name];
        apiLanguage = apiLanguage.concat(hint);
    }
    return apiLanguage;
}

var apiLanguage = buildLanguageWithHints();


function isPluginLanguageOrSynonym(word){
    word = word.toLowerCase();

    var hit = contains_lowerCase(apiLanguage, word, true);
    hit = reduceSynonymToAPIName(hit);
    if (hit) return hit;
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

/* LoL */
function isSynonym(word1, word2){
    word1 = word1.toLowerCase();
    word2 = word2.toLowerCase();
    if (word1 == word2) {
        return true;
    }
    return false;
}


/*
*   {
*       type: "intention",
*       value: "turnon"  
*   }
*/
service.ClassifySentence = function(words){
    var wordParts = [];

    var allMod = false;

    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        wordParts.push(service.ClassifyWord(words[i]));
        if (isSynonym(word, "alle")) {
            allMod = true;
        }
    }

    return wordParts;
};




module.exports = service;