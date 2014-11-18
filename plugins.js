var _=require('lodash');

var Plugins = function (){
};

var all = [{
	plugin_name : "Wol",
	services : [{
		name: "Nas On",
		homescreen: 2,
		type:"toggle"
	}]
},
{
	plugin_name : "Lights",
	services : [{
		name: "All On",
		homescreen: 0,
		type:"toggle"
	}, 
	{
		name: "All Off",
		homescreen: 1,
		type:"toggle"
	}]
}];




Plugins.prototype.getAll = function () {
	return all;
};


Plugins.prototype.getAllServices = function () {
	var allPlugins = this.getAll();
	var allServices = [];
	for (var i = 0; i < allPlugins.length; i++) {
		
		var pluginservices = allPlugins[i].services;

		_(pluginservices).forEach(function(service) { 
			service.plugin_name = allPlugins[i].plugin_name;
			service.service_id = service.plugin_name+service.name;
		});

		allServices = _.union(allServices, pluginservices);

	}
	return allServices;
};


Plugins.prototype.getHome = function () {
	var services = this.getAllServices();
	var homeservices = _.filter(services, function(s) { return s.homescreen >= 0; });

	var sortedhomeservices = _.sortBy(homeservices, 'homescreen');
	return sortedhomeservices;
};




var plugins = new Plugins();

module.exports = plugins;
