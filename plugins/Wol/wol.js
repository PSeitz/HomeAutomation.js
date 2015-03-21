var wol = require('wake_on_lan');

var config = require('../../configloader')("Wol");

var omv ='bc:5f:f4:cd:e0:3b';
var htpc = 'BC-5F-F4-84-D7-B7';

var wakeNas = function(){
    wol.wake(omv);
};

var wakeHTPC = function(){
    wol.wake(htpc);
};

exports.getName = function(){
    return "WOL";
};

// exports.services = function(){
//     return [{
//         action : wakeNas,
//         name: "Nas On"
//     },{
//         action : wakeHTPC,
//         name: "HTPC On"
//     }];
// };

function createfunc(mac_adress) {
    return function() { wol.wake(mac_adress); };
}

exports.services = function(){
    var actions = [];
    for (var prop in config.services) {
        var deviceName = config.services[prop];
        actions.push({
            name: prop,
            action : createfunc(config.devices[deviceName])
        });
    }
    return actions;
};

exports.settings = function(){
    return "settings.html";
};
