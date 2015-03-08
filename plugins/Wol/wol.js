var wol = require('wake_on_lan');

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

exports.services = function(){
    return [{
        action : wakeNas,
        name: "Nas On",
        homescreen: 3
    },{
        action : wakeHTPC,
        name: "HTPC On",
        homescreen: -1
    }];
};


exports.settings = function(){
    return "settings.html";
};
