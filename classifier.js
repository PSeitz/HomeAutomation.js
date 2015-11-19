var service = {};
var _=require('lodash');
var levenshtein = require('fast-levenshtein');
var germansynonyms = require('germansynonyms');
// var cld = require('cld');

var configLoader = require('./configloader');

// build plugin language
var allTargets = configLoader.getAllTargets();
var allLocations = configLoader.getAllLocations();
var allCommands = configLoader.getAllCommands();
var synonym_hints = configLoader.get("SynonymHints");

var langs = configLoader.get("Languages");

var colors = require('./speech/colors');

function reduceSynonymToAPIName(word){

    if (!word) return word;
    for (var prop in synonym_hints) {
        if(word === prop.toLowerCase()) return prop;
        
        hit = contains_lowerCase(synonym_hints[prop], word, false);
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


function getPluginLanguageOrSynonym(word){
    word = word.toLowerCase();
    var hit = contains_lowerCase(apiLanguage, word, false);
    hit = reduceSynonymToAPIName(hit);
    if (hit) return hit;
    return word;
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
    if(contains_lowerCase(allCommands, word, true)) return "action";
    if(!isNaN(word)) return "number";
    if(!isNaN(word.split("%")[0])) return "number";
    if (colors.getColorForName(word)) return "color";
    return "unknown";
    // console.warn("Oh no not found");
}

/*
*   {
*       type: "intention",
*       value: "turnon"  
*   }
*/
service.ClassifyWord = function(word){
    word = word.toLowerCase();
    var originalAPIWord = getPluginLanguageOrSynonym(word);
    return {
        type:  getType(originalAPIWord),
        value: originalAPIWord
    };

};

/* LoL */
function isSynonym(word1, word2){
    word1 = word1.toLowerCase().trim();
    word2 = word2.toLowerCase().trim();
    if (word1 == word2) {
        return true;
    }
    return false;
}


function lookForward_getAction (words, index) {
    for (var i = index; i < words.length; i++) {
        var word = words[i];

        var classifiedWord = service.ClassifyWord(word);

        if (classifiedWord.type == "action") {
            classifiedWord.index = i;
            return classifiedWord;
        }
    }
    return undefined;
}

function getNewIntention(){
    return {
        locations: [],
        targets: [],
        adjectives: [],
        action: undefined,
        value: undefined,
        valueType: "absolute"
    };
}

/*
*   {
*       type: "intention",
*       value: "turnon"  
*   }
*/
service.getIntentions = function(words){
    var intentions = [];

    var currentIntent = getNewIntention();

    var first = true;
    var nextIntent = function(){
        if (currentIntent.action) {
            currentIntent = getNewIntention();
        }
        // if (intentions.length !== 0) { // use for first call object above
        //     currentIntent = getNewIntention();
        // }
        intentions.push(currentIntent);
        return currentIntent;
    };

    for (var i = 0; i < words.length; i++) {
        var word = words[i];

        var classifiedWord = service.ClassifyWord(word);
        classifiedWord.index = i;

        if (classifiedWord.type == "action") {
            nextIntent();
            currentIntent.action = classifiedWord.value;
        }
        if (classifiedWord.type == "target") {
            currentIntent.targets.push(classifiedWord.value);
        }
        if (classifiedWord.type == "location") {
            currentIntent.locations.push(classifiedWord.value);
        }
        if (classifiedWord.type == "adjective") {
            currentIntent.adjectives.push(classifiedWord.value);
        }
        if (classifiedWord.type == "number") {
            currentIntent.value = classifiedWord.value.split("%")[0];
            if(word.indexOf("%") >= 0) currentIntent.valueType = "percent";
        }
        if (classifiedWord.type == "color") {
            currentIntent.adjectives.push({
                value: colors.getColorForName(word),
                type: "color"
            });
        }

        // Licht an im Flur und Licht aus Im Wohnzimmer
        if (isSynonym(word, "und")) {
            var nextAction = lookForward_getAction(words, i+1); 
            if (!nextAction) 
                continue; // no action for second clause
            nextIntent();
            currentIntent.action = nextAction.value;
            words[nextAction.index] = "NIXNIX";
        }

        if (isSynonym(word, "Prozent")) {
            currentIntent.valueType = "percent"; 
        }
    }
    if (intentions.length === 0) // Actionless intent
        nextIntent();
    

    return intentions;
};



module.exports = service;