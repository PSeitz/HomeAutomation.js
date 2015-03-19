var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    lightState = hue.lightState;
var _=require('lodash');

var yaml = require('js-yaml');

var config = require('../../configloader')("ControlHue");

var controlLights = function(result, lightstate, matching) {
    console.log(JSON.stringify(lightstate, null, 2));
    
    var lights = result.lights;

    for (var i = 0; i < lights.length; i++) {
        if( matches(lights[i].name, matching) ){
            // lightstate.on = true;
            api.setLightState(lights[i].id, lightstate, function(err, result) {
                // if (err) console.log(err.toString());
                // displayResult(result);
                console.log('light set');
            });
        }
    }
};

var matches = function(lightName, matches ){

    if (Object.prototype.toString.call( matches ) === '[object Array]' ) {
        for (var i = 0; i < matches.length; i++) {
            if (lightName.indexOf(matches[i]) !== -1) return true;
        }
        return false;
    }else{
        return lightName.name.indexOf(matches) !== -1;
    }
};

// var allLamps = ["WZ Links", "WZ Rechts", "WZ Back", "WZ Back Links", "Flur", "SZ I", "SZ O 1", "AZ Vorne", "AZ Hinten"];
// var wohnzimmer = ["WZ Links", "WZ Rechts", "WZ Back", "WZ Back Links"];
// var schlafzimmer = ["SZ I", "SZ O 1"];
// var arbeitszimmer = [ "AZ Vorne", "AZ Hinten"];

var flur = [ "Flur"];

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var displayError = function(err) {
    console.log(err);
};
// var wakeUp = function(){
//     controlLights(hueLights, {"transitiontime": 600, "bri": 254, "on": true, "hue": 15760, "saturation":93}, ["SZ", "Flur"]);
// };
// var allOn = function(){
//     controlLights(hueLights, {"transitiontime": 1, "bri": 254, "on": true, "hue": 15760, "saturation":93}, allLamps);
// };
// var allOff = function(){
//     controlLights(hueLights, {"transitiontime": 1,"on": false}, allLamps);
// };
var only = function(onLamps){
    var off = _.difference(allLamps, onLamps);
    controlLights(hueLights, {"transitiontime": 1, "on": true, "bri": 254, "hue": 15760, "saturation":93}, onLamps);
    controlLights(hueLights, {"transitiontime": 1, "on": false}, off);
};
var lightUp = function(){
    controlLights(hueLights, {"transitiontime": 60, "bri": 254, "on": true, "hue": 15760, "saturation":93}, ["AZ", "Flur", "WZ"]);
};

exports.getName = function(){
    return "Lights";
};

// exports.services = function(){
//     return [{
//         action : allOff,
//         name: "All Off"
//     },{
//         action : allOn,
//         name: "All On"
//     },{
//         action : function(){
//             only(wohnzimmer);
//         },
//         name: "Wohnzimmer",
//         onWebsocketConnection: function(ws){
//             ws.send("YEAG");
//             // setInterval(function(){
//             //     var blub = (Math.random() * 10).toString();
//             //     ws.send(blub);
//             // }, 600);
//         }
//     },{
//         action : function(){
//             only(schlafzimmer);
//         },
//         name: "Schlafzimmer"
//     },{
//         action :  function(){
//             only(arbeitszimmer);
//         },
//         name: "Arbeitszimmer"
//     },{
//         action : function(){
//             only(schlafzimmer.concat(flur));
//         },
//         name: "Aufstehen"
//     }];
// };

function createfunc(lights) {
    return function() { only(lights); };
}

exports.services = function(){
    var actions = [];
    for (var prop in config.actions) {
        actions.push({
            name: prop,
            action : createfunc(config.actions[prop])
        });
    }
};



// console.log(config.actions.Wohnzimmer);

// var hostname = "192.168.0.59";
// var token = "3cae5b382976779f2f30cce81ea78faf";

// var api = new HueApi(hostname, token);

var api = new HueApi(config.hostname, config.token);


//Initial load all lights
var hueLights;
api.lights(function(err, lights) {
    hueLights = lights;
});

