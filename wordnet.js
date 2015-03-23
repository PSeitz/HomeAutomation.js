
var verbs = {
    play: ["abspielen", "spielen"],
    switchto: ["umschalten"],
    turnon: ["an", "anschalten", "aktivieren", "anknipsen", "anmachen"],
    turnoff: ["aus" , "abschalten", "ausmachen", "ausschalten", "turn off", "ausknipsen", "eliminieren",
                "liquidieren", "neutralisieren", "terminieren", "スイッチを切る"],
    increase: ["erhöhen", "anheben", "lauter"],
    decrease: ["leiser", "absenken", "reduzieren"]
};


var service = {};

service.getSynonym = function(name){

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

};