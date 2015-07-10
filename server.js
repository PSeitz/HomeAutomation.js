console.time('ServerStart');

var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var server = http.createServer(app);
server.listen(80);
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.text({ type: 'text/html' }));
// app.use(bodyParser.text({ type: 'plain/text' }));
app.use(cookieParser());



// path:middleware
var dispatch = {};

var WebSocketServer = require('ws').Server;
app.ws = function(path, middleware){
	dispatch[path] = middleware;
};


var wss = new WebSocketServer({
	server: server
});
wss.on('connection', function(ws) {
	// console.log(ws);
	if (dispatch[ws.upgradeReq.url]){
		dispatch[ws.upgradeReq.url](ws);
	}else{
		ws.close();
	}
});

var service = {};
service.addWebservice = function(path, cb){
    app.ws(path, cb);
};
module.exports = service;

// var expressWs = require('express-ws')(app, server);
var plugins = require('./plugins');
plugins.loadPlugins();
plugins.activateServices();
var sorting = require("./homescreensortorder");

var speechModule = require('./speech');

require("dot").process({
    global: "_page.render",
    destination: __dirname + "/render/",
    path: (__dirname + "/views")
});

var render = require('./render');


var renderDotTemplate = function(bodyfun, templateData){
    templateData.body = render[bodyfun](templateData);
    templateData.server = service;
    templateData.title = "HomeAutomation";
    return render.layout(templateData);
};

// app.ws('/LightsWohnzimmer', function(ws) {
//     // ws.on('message', function(msg) {
//     //     console.log('echo received' + msg);
//     //     ws.send("LightsWohnzimmer");
//     // });
//     ws.send("LightsWohnzimmer");
// });

app.get('/', function(req, res) {
    var homeservices = plugins.getHome();
    var allPlugins = plugins.getAll();
    console.log("print homeservices[i]");
    for (var i = 0; i < homeservices.length; i++) {
        console.log(homeservices[i]);
    }
    res.send(renderDotTemplate("main", {
        services: homeservices,
        plugins: allPlugins
    }));
});

/*
*   {
        plugin_name: aaa,
        name: bbb,
        service_id: aaabbb,
        services: [yoo, yeah]
        template: blubber
    }
*/
var allServices = plugins.getAllServices();

//Add Service paths
allServices.forEach(function (element, index, array) {
    // console.log(element.service_id);
    app.get("/"+element.service_id, function(req, res) {
        res.send('hehehe!');
        if (element.action) element.action();
    });
});

//Plugin Service Lists
var allPlugins = plugins.getAll();
allPlugins.forEach(function (element, index, array) {
    app.get('/'+element.plugin_name, function(req, res) {
        res.send(renderDotTemplate("settings", {
            services: element.services,
            plugins: allPlugins
        }));
    });
});


// app.post("/speech/", function(req, res) {
//     var speech = req.params;


// });


app.post("/speech/", function(req, res) {
	var speech = req.body;
    console.log(speech);
    speechModule.handleSpeech(speech);

	res.send('hehehe!');

});

// setTimeout(function(){
// 	speechModule.handleSpeech("Alle Lichter aus");
// }, 5000);

app.get("/settings", function(req, res) {
    var allServices = plugins.getAllServices();
    console.log(allServices);
    res.send(renderDotTemplate("settings", {
        services: allServices,
        plugins: allPlugins
    }));
});

app.post("/newhomeorder", function(req, res) {
    console.log(req.body);
    res.send('hehehe!');

    sorting.setPositions(req.body.list);
});

app.get("/download/:system/:id/:name", function(req, res) {
    var id = req.params.id;
    var game = req.params.name;
    var system = req.params.system;
});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'dot' );
// app.engine('html', doT.__express );

app.use(express.static(path.join(__dirname, 'public')));


console.timeEnd('ServerStart');
















