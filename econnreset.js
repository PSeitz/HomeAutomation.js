var HueApi = require("node-hue-api").HueApi;

var hostname = "hostname";
var token = "token";

var api = new HueApi(hostname, token);

api.lights(function(err, result) {
    console.log("Get Light Status of all");
    for (var i = 0; i < result.lights.length; i++) {
        api.lightStatus(result.lights[i].id, function(err, result) {
            if (err) throw err;
        });
    }
});
// Bride Version: 01024156
// node v0.12.1
// hue api 1.0.5