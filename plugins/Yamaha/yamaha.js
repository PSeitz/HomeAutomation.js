var yamaha = require('yamaha-nodejs');

var config = require('../../configloader').get("Yamaha");

var yomaha = new yamaha(config.ip);

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

exports.commandApi = function(command){

};
