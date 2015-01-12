var querystring = require('querystring');
var http = require('http');
var _ = require('lodash');

var cachedData;
function getPostOptions(post_data_string, targetIP) {
    var post_options = {
        host: targetIP,
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

function requestIt(post_data, targetIP, cb) {

    var post_data_string = JSON.stringify(post_data);

    // Set up the request
    var post_req = http.request(getPostOptions(post_data_string, targetIP), function(res) {
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function(chunk) {
            if (cb) cb(JSON.parse(data));
            
        });
        res.on('error', function(e){
            console.log(e);
        });
    });

    post_req.on('error', function(e){
        console.log(e);
    });

    // post the data
    post_req.write(post_data_string);
    post_req.end();

}

function getAllTVShows(targetIP, cb) {

    var post_data = {
        "jsonrpc": "2.0",
        "method": "VideoLibrary.GetTVShows",
        "id": 1,
        "params": {
            // "properties": ["genre", "plot", "title", "lastplayed", "episode", "year", "playcount", "rating", "thumbnail", "studio", "mpaa", "premiered"]
            "properties": ["title"]
        }
    };
    requestIt(post_data, targetIP, cb);

}


function findFamilyGuyShowId(targetIP, cb) {

    getAllTVShows(targetIP, function(data) {
        console.log(data["result"]);
        if (!data || !data.result || !data.result.tvshows) {
            console.log("Nothing found");
            return;
        }

        var shows = data.result.tvshows;
        for (var i = 0; i < shows.length; i++) {
            if(shows[i].label=="Family Guy"){
                cb(shows[i].tvshowid);
                return;
            }
        }
    });

}

function getAllEpisodes(targetIP, cb) {

    // if (cachedData) return cb(cachedData);

    findFamilyGuyShowId(targetIP, function(showid){

        var post_data = {
            "jsonrpc": "2.0",
            "method": "VideoLibrary.GetEpisodes",
            "id": 1,
            "params": {
                // "properties": ["title", "thumbnail", "episode", "plot", "season"],
                "properties": ["episode"],
                "tvshowid": showid
            }
        };
        requestIt(post_data, targetIP, cb);
    });

}

function play(id, targetIP) {

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

    requestIt(post_data, targetIP);

}

function playRandom(targetIP) {
    getAllEpisodes(targetIP, function(data) {
        var eps = data.result.episodes;
        var ep = _.sample(eps);
        console.log(ep);
        play(ep.episodeid, targetIP);
    });
}

exports.getName = function(){
    return "Xbmc";
};

exports.services = function(){
    return [{
        action : function(){
            playRandom('192.168.0.29');
            playRandom('192.168.0.21');
        },
        name: "Random FamilyGuy"
    }];
};


