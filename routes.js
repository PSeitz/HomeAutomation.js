var express = require('express');
var router = express.Router();

var plugins = require('./plugins');
var sorting = require("./homescreensortorder");

require("dot").process({
	global: "_page.render"
	, destination: __dirname + "/render/"
	, path: (__dirname + "/views")
});

var render = require('./render');


var renderDotTemplate = function(bodyfun, options){
	options.body = render[bodyfun](options);
	return render.layout(options);
};


router.get('/', function(req, res) {
	var homeservices = plugins.getHome();
	var allPlugins = plugins.getAll();
	for (var i = 0; i < homeservices.length; i++) {
		console.log(homeservices[i]);
	}
	res.send(renderDotTemplate("main", {
		title: "HomeAutomation",
		services: homeservices,
		plugins: allPlugins
	}));
});

/*
*	{
		plugin_name: aaa,
		name: bbb,
		service_id: aaabbb,
		services: [yoo, yeah]
		template: blubber
	}
*
*/
var allServices = plugins.getAllServices();

allServices.forEach(function (element, index, array) {
	console.log(element.service_id);
	router.get("/"+element.service_id, function(req, res) {
		res.send('hehehe!');
		if (element.action) element.action();
	});
});

//Plugin Service Lists
var allPlugins = plugins.getAll();
allPlugins.forEach(function (element, index, array) {
	router.get('/'+element.plugin_name, function(req, res) {
		res.send(renderDotTemplate("settings", {
			title: "HomeAutomation",
			services: element.services,
			plugins: allPlugins
		}));
	});
});

router.get("/settings", function(req, res) {
	var allServices = plugins.getAllServices();
	res.send(renderDotTemplate("settings", {
		title: "HomeAutomation",
		services: allServices,
		plugins: allPlugins
	}));
});

router.post("/newhomeorder", function(req, res) {
	console.log(req.body);
	res.send('hehehe!');

	sorting.setPositions(req.body.list);
});

router.get("/download/:system/:id/:name", function(req, res) {
	var id = req.params.id;
	var game = req.params.name;
	var system = req.params.system;
});


module.exports = router;
