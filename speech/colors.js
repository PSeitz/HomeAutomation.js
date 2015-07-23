
var colornames = require('./colornames.json');


var service = {};

service.getColorForName = function(colorname){

    if (colornames[colorname]) {
        return colornames[colorname];
    }
    return undefined;

};

module.exports = service;