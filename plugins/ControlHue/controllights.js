var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    lightState = hue.lightState;
var _= require('lodash');
var yaml = require('js-yaml');
var configLoader = require('../../configloader');
var config = configLoader.get("Lights");

var api = new HueApi(config.hostname, config.token);

//Initial load all lights
var hueLights;
api.lights(function(err, result) {
    hueLights = result.lights;
});

function getLightsForName(allLights, lights){
    var matchingLights = [];
    for (var i = 0; i < allLights.length; i++) {
        if( lights.indexOf(allLights[i].name) >= 0 )
            matchingLights.push(allLights[i]);
    }
    return matchingLights;
}

var controlLights = function(allLights, lightstate, matching) {
    console.log(JSON.stringify(allLights, null, 2));
    var lights = getLightsForName(allLights, matching);
    for (var i = 0; i < lights.length; i++) {
            // lightstate.on = true;
        api.setLightState(lights[i].id, lightstate, function(err, result) {
            // if (err) console.log(err.toString());
            // displayResult(result);
            console.log('light set');
        });
    }
};

// var matches = function(lightName, matching ){

//     if (Object.prototype.toString.call( matching ) === '[object Array]' ) {
//         for (var i = 0; i < matching.length; i++) {
//             if (lightName.indexOf(matching[i]) !== -1) return true;
//         }
//         return false;
//     }else{
//         return lightName.name.indexOf(matching) !== -1;
//     }
// };

// var allLamps = ["WZ Links", "WZ Rechts", "WZ Back", "WZ Back Links", "Flur", "SZ I", "SZ O 1", "AZ Vorne", "AZ Hinten"];
// var wohnzimmer = ["WZ Links", "WZ Rechts", "WZ Back", "WZ Back Links"];
// var schlafzimmer = ["SZ I", "SZ O 1"];
// var arbeitszimmer = [ "AZ Vorne", "AZ Hinten"];
// var flur = [ "Flur"];

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var displayError = function(err) {
    console.log(err);
};

var lightOn = function(lights){
    controlLights(hueLights, {"transitiontime": 1, "on": true, "bri": 254}, lights);
};
var lightOff = function(lights){
    controlLights(hueLights, {"transitiontime": 1, "on": false, "bri": 254}, lights);
};

var only = function(onLamps){
    var offLamps = _.difference(config.devices, onLamps);
    lightOn(onLamps);
    lightOff(offLamps);
    // controlLights(hueLights, {"transitiontime": 1, "on": true, "bri": 254, "hue": 15760, "saturation":93}, onLamps); //"hue": 15760, "saturation":93
    // controlLights(hueLights, {"transitiontime": 1, "on": false}, off);
};

var alterBrightnessOfLamps = function(deltaValue, lamps){
    var lights = getLightsForName(hueLights, lamps);
    console.log(JSON.stringify(lights, null, 2));
    for (var i = 0; i < lights.length; i++) {
        var light = lights[i];
        alterBrightnessOfLamp(deltaValue, light);
    }
};

function alterBrightnessOfLamp(deltaValue, light){
    api.lightStatus(light.id, function(err, result) {
        if (err) throw err;
        var newbrightness = result.state.bri + deltaValue;
        newbrightness = Math.min(newbrightness, 255);
        newbrightness = Math.max(newbrightness, 0);
        api.setLightState(light.id, {"bri":newbrightness}, function(err, result) {});
    });
}


exports.getName = function(){
    return "Lights";
};

function createfunc(lights) {
    return function() { only(lights); };
}

exports.services = function(){
    var actions = [];
    for (var prop in config.services) {
        actions.push({
            name: prop,
            action : createfunc(config.services[prop])
        });
    }
    return actions;
};


exports.commandApi = function(command){
    var lamps = command.devices || config.devices;

    if (command.action == "turnon") {
        lightOn(lamps);
    }
    if (command.action == "turnoff") {
        lightOff(lamps);
    }
    if (command.action == "decrease") {
        alterBrightnessOfLamps(-80, lamps);
    }
    if (command.action == "increase") {
        alterBrightnessOfLamps(80, lamps);
    }

};


