var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    lightState = hue.lightState;
var _= require('lodash');
var yaml = require('js-yaml');
var configLoader = require('../../configloader');
var config = configLoader.get("Lights");
var colorToHue = require("./../../speech/colorToHue");

var api = new HueApi(config.hostname, config.token);

//Initial load all lights
var hueLights;
api.lights(function(err, result) {
    hueLights = result.lights;
});

function compare(light_a, light_b) {
    if (light_a.name == light_b.name) {
        return 0;
    }
    if (light_a.name < light_b.name) {
        return -1;
    }
    return 1;
}

function getLightsForName(allLights, lights){
    var matchingLights = [];
    for (var i = 0; i < allLights.length; i++) {
        if( lights.indexOf(allLights[i].name) >= 0 )
            matchingLights.push(allLights[i]);
    }
    matchingLights.sort(compare);

    return matchingLights;
}

var controlLights = function(allLights, lightstate, lamps) {
    console.log(JSON.stringify(allLights, null, 2));
    var lights = getLightsForName(allLights, lamps);
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

// var alterBrightnessOfLamps = function(deltaValue, lamps){
//     var lights = getLightsForName(hueLights, lamps);
//     console.log(JSON.stringify(lights, null, 2));
    // for (var i = 0; i < lights.length; i++) {
    //     var light = lights[i];
    //     deltaAlterBrightnessOfLamp(deltaValue, light);
    // }

    
// };

var alterLampsWithAction = function(action, lamps, ligthstate, colors){
    var lights = getLightsForName(hueLights, lamps);
    console.log(JSON.stringify(lights, null, 2));
    for (var i = 0; i < lights.length; i++) {
        var light = lights[i];
        // action(ligthstate, light);
    }

    var colorPos = 0;
    function handleQueue()
    {
        var light = lights.pop();
        if (light) {
            if (colors && colors[0]) {
                var xycolors = colorToHue.hexStringToXyBri(colors[colorPos]);
                ligthstate.xy = [xycolors.x, xycolors.y];
                colorPos++; 
                if(!colors[colorPos]) colorPos = 0;
            }
            
            action(ligthstate, light); 
        }
        if (lights.length === 0) {
            clearInterval(interval); 
        }
    }

    var interval = setInterval(handleQueue, config.queueRate || 350);

};

function setLightState (lightstate, light) {
    api.setLightState(light.id, lightstate, function(err, result) {
        console.log('light set');
    });
}
// function setLightOn (lightstate, light) {
//     api.setLightState(light.id, lightstate, function(err, result) {
//         console.log('light set');
//     });
// }

function deltaAlterBrightnessOfLamp(deltaValue, light){
    api.lightStatus(light.id, function(err, result) {
        if (err) throw err;
        var newbrightness = result.state.bri + deltaValue;
        newbrightness = Math.min(newbrightness, 255);
        newbrightness = Math.max(newbrightness, 0);
        api.setLightState(light.id, {"bri":newbrightness}, function(err, result) {});
    });
}

function setBrightnessOfLamp(newbrightness, light){
    newbrightness = Math.min(newbrightness, 255);
    newbrightness = Math.max(newbrightness, 0);
    api.setLightState(light.id, {"bri":newbrightness, "on": true}, function(err, result) {});
}

exports.getName = function(){
    return "Lights";
};

function onlyWrapper(onLamps) {
    return function() { 
        var offLamps = _.difference(config.devices, onLamps);
        alterLampsWithAction(setLightState, onLamps, {"transitiontime": 0, "on": true, "bri": 254, "hue": 15760, "saturation":93});
        alterLampsWithAction(setLightState, offLamps, {"transitiontime": 0, "on": false});
    };
}

exports.services = function(){
    var actions = [];
    for (var prop in config.services) {
        actions.push({
            name: prop,
            action : onlyWrapper(config.services[prop])
        });
    }
    return actions;
};


function getNames (lamps) {
    var str = '';
    var first = false;
    for (var i = 0; i < lamps.length; i++) {
        // if (!first) str += ', ';
        var lamp = lamps[i];
        str += ' '+lamp+' ';
        // first = false;
        str += ', ';
    }

    str = str.toLowerCase();
    str = str.replace(/wz/g, 'Wohnzimmer');
    str = str.replace(/sz/g, 'Schlafzimmer');
    str = str.replace(/az/g, 'Arbeitszimmer');
    str = str.replace(/back/g, 'Hinten');

    
    return str;
}

exports.commandApi = function(command){
    var lamps = command.devices || config.devices;

    command.action = command.action || "turnon";

    console.log(command);

    var colors = [];
    for (var i = 0; i < command.adjectives.length; i++) {
        var adj = command.adjectives[i];
        if (adj.type == "color"){
            if( Object.prototype.toString.call( adj.value.hex ) === '[object Array]' )
                colors.push.apply(colors, adj.value.hex);
            else
                colors.push(adj.value.hex);
        }
    }

    var lightstate = {};

    if (command.action == "turnon") {
        lightstate.on = true;
    }
    if (command.action == "turnoff") {
        lightstate.on = false;
    }

    if (command.action == "decrease" || command.action == "increase" && !command.value) {
        command.value = 80; // 80 is default reduce/increase
    }

    function cb(state, light){
        api.lightStatus(light.id, function(err, result) {
            if (err) throw err;

            lightstate.bri = 254;
            if (result.state.bri > 15) // reuse current brightness
                lightstate.bri = result.state.bri;
            
            if (command.value) {
                var newbrightness = command.value;
                if (command.valueType === "percent")
                    newbrightness = command.value * 255 / 100;

                if (command.action == "decrease" || command.action == "increase") {
                    var delta = command.value;
                    if (command.valueType === "percent")
                        delta = result.state.bri * (command.value / 100);

                    if (command.action == "decrease") delta = delta * -1;
                    newbrightness = result.state.bri + delta;
                }

                newbrightness = Math.min(newbrightness, 255);
                newbrightness = Math.max(newbrightness, 0);
                state.bri = newbrightness;
                state.on = true;
            }

            if (!result.state.on || command.action == "turnoff") 
                state.transitiontime = 0;

            api.setLightState(light.id, state, function(err, result) {
                console.log('light set');
            });
        });

    }

    alterLampsWithAction(cb, lamps, lightstate, colors);

    // alterLampsWithAction(setLightState, lamps, lightstate, colors);
    return "Blub"



};


