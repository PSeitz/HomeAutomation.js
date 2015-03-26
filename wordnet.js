var cld = require('cld');

var LanguageDetect = require('languagedetect');
var lngDetector = new LanguageDetect();

console.time('Timer Title');

var string = 'Das ist ein Test おねがいします Fernseher anschalten';
cld.detect(string, function(err, result) {
    console.log(result);

    var pos = 0;
    for (var i = 0; i < result.chunks.length; i++) {
        if (!result.chunks[i]) continue;
        console.log(string.substr(pos, result.chunks[i].offset));
        pos += result.chunks[i].offset;
    }
    console.log(string.substr(pos, string.length));

});

console.timeEnd('Timer Title');

// console.log(lngDetector.getLanguages());

// console.log(lngDetector.detect('This is a language recognition example'));
// console.log(lngDetector.detect('Das ist ein Test'));
// console.log(lngDetector.detect('ola hombre senior'));
// console.log(lngDetector.detect('おねがいします'));


var syn = require("germansynonyms");
var synonyms = syn.getAllSynonyms("anschalten");

console.log(synonyms);