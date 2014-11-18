var express = require('express');
var router = express.Router();
var path = require("path");

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



router.get("/download/:system/:id/:name", function(req, res) {
	var id = req.params.id;
	var game = req.params.name;
	var system = req.params.system;



});


module.exports = router;
