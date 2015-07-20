
var speech = require('./speech');

var result = speech.semanticResult("Im Arbeitszimmer und im Flur Licht ausmachen");

console.log(result);

var result = speech.semanticResult("Im Arbeitszimmer Licht anmachen und im Flur Licht ausmachen");

console.log(result);


var result = speech.semanticResult("Helligkeit auf 50 Prozent im Wohnzimmer");

console.log(result);

var result = speech.semanticResult("Licht an im Arbeitszimmer");

console.log(result);

var result = speech.semanticResult("Fernseher im Wohnzimmer anschalten");

console.log(result);


// setTimeout(function(){
//     // advancedMeaningRecognition("Im Arbeitszimmer und im Flur Licht ausmachen");
//     speech.advancedMeaningRecognition("Licht an im Arbeitszimmer");
// }, 3000);