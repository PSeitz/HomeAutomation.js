var express = require('express');
var router = express.Router();

var plugins = require('./plugins');

router.get('/', function(req, res) {
	var homeservices = plugins.getHome();
	for (var i = 0; i < homeservices.length; i++) {
		console.log(homeservices[i]);
	}
	res.render('index.html', {
		title: "HomeAutomation",
		services: homeservices
	});
});

var allServices = plugins.getAllServices();

allServices.forEach(function logArrayElements(element, index, array) {
	console.log(element.service_id);
	router.get("/"+element.service_id, function(req, res) {
		res.send('hehehe!');
		if (element.action) element.action();
	});
});

router.get("/download/:system/:id/:name", function(req, res) {
	var id = req.params.id;
	var game = req.params.name;
	var system = req.params.system;
});


module.exports = router;
