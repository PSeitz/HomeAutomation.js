var querystring = require('querystring');
var http = require('http');
var _ = require('lodash');

var cachedData;
function getPostOptions(post_data_string) {
    var post_options = {
        host: '192.168.0.29',
        port: '80',
        path: '/jsonrpc',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(post_data_string)
        }
    };
    return post_options;
}

function getAllEpisodes(cb) {

    if (cachedData) return cb(cachedData);

    var post_data = {
        "jsonrpc": "2.0",
        "method": "VideoLibrary.GetEpisodes",
        "id": 1,
        "params": {
            "properties": ["title", "thumbnail", "episode", "plot", "season"],
            "tvshowid": 16
        }
    };
    var post_data_string = JSON.stringify(post_data);

    // Set up the request
    var post_req = http.request(getPostOptions(post_data_string), function(res) {
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function(chunk) {
            // console.log(JSON.parse(data));
            cachedData = JSON.parse(data);
            cb(cachedData);
        });
    });

    // post the data
    post_req.write(post_data_string);
    post_req.end();

}

function play(id) {

    var post_data = {
        "jsonrpc": "2.0",
        "method": "Player.Open",
        "id": 1,
        "params": {
            "item": {
                "episodeid": id
            }
        }
    };

    var post_data_string = JSON.stringify(post_data);

    // Set up the request
    var post_req = http.request(getPostOptions(post_data_string), function(res) {
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function(chunk) {
            // console.log(JSON.parse(data));
        });
    });

    // post the data
    post_req.write(post_data_string);
    post_req.end();


}

function playRandom() {
    getAllEpisodes(function(data) {
        var eps = data.result.episodes;
        var ep = _.sample(eps);
        console.log(ep);
        play(ep.episodeid);
    });
}

exports.getName = function(){
    return "Xbmc";
};

exports.services = function(){
    return [{
        action : function(){
            playRandom();
        },
        name: "Random FamilyGuy"
    }];
};


