var yamaha = require('yamaha-nodejs');
var yomaha = new yamaha("192.168.0.25");

exports.getName = function(){
    return "Yamaha";
};

exports.services = function(){
    return [{
        action : function(){
            yomaha.switchToFavoriteNumber(1);
        },
        name: "Nice Tunes"
    }];
};


