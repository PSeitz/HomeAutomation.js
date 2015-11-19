var http = require('http');
// var plugins = require('./plugins');
var configLoader = require('./configloader');
var config = configLoader.get("Say");
var _ = require('lodash');

var service = {};

console.log(config);

service.say = function (text) {

    for (var i = 0; i < config.length; i++) {
        var say_server = config[i];

        http.get("http://"+say_server+"/say/"+text, function(res) {
          console.log("Got response: " + res.statusCode);
        }).on('error', function(e) {
          console.log("Got error: " + e.message);
        });
    }
}


module.exports = service;