var wol = require('wake_on_lan');

var config = require('../../configloader');
var wolConfig = config.get("Wol");
var devices = config.get("Devices");

var wakeNas = function(){
    console.log(var1);
    wol.wake(omv);
};

var wakeHTPC = function(){
    wol.wake(htpc);
};

exports.getName = function(){
    return "Wol";
};

function createfunc(mac_adress) {
    return function() {
        console.log("Waking "+mac_adress);
        wol.wake(mac_adress);
    };
}
exports.services = function(){
    var actions = [];
    for (var prop in wolConfig.services) {
        var deviceName = wolConfig.services[prop];
        actions.push({
            name: prop,
            action : createfunc(devices[deviceName])
        });
    }
    return actions;
};

exports.settings = function(){
    return "settings.html";
};

exports.commandApi = function(command){

};

/* Config  Example 


Wol:
    devices: ["Nas"]

Devices: 
    Nas:
        location: Arbeitszimmer
        mac: 'bc:5f:f4:cd:e0:3b'

*/