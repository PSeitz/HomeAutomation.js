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
var only = function(onLamps){
    var off = _.difference(config.devices, onLamps);
    controlLights(hueLights, {"transitiontime": 1, "on": true, "bri": 254, "hue": 15760, "saturation":93}, onLamps);
    controlLights(hueLights, {"transitiontime": 1, "on": false}, off);
};
var lightUp = function(){
    controlLights(hueLights, {"transitiontime": 60, "bri": 254, "on": true, "hue": 15760, "saturation":93}, ["AZ", "Flur", "WZ"]);
};

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

var api = new HueApi(config.hostname, config.token);

//Initial load all lights
var hueLights;
api.lights(function(err, lights) {
    hueLights = lights;
});

