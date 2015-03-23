var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var sorting = require("./homescreensortorder");

var configLoader = require('./configloader');

var pluginsFolder = './plugins';
var dot = require("dot");

function validatePlugin(plugin, pluginFolder){
    try {
        plugin.plugin_name = plugin.getName();
        plugin.services = plugin.services();
        if (!plugin.commandApi) throw "No plugin commandApi";
    } catch (err) {
        var error = new Error('Error in Plugin:'+pluginFolder);
        console.log(error);
        throw error;
    }
}

// var controlLights = require("./plugins/ControlHue/controllights");
// var wol = require("./plugins/Wol/wol");

var Plugins = {};

Plugins.loadPlugins = function() {
    var allPlugins = [];
    fs.readdirSync(pluginsFolder).forEach(function(file) {
        var pluginFolder = path.join(__dirname,pluginsFolder, file);
        console.log(pluginFolder);
        var pathToConfig = path.join(pluginFolder, ".homeauto.json"); //if there is a homeauto.json, there is a plugin
        console.log(pathToConfig);
        if (fs.existsSync(pathToConfig)) {
            var pluginConfig = require(pathToConfig);
            var pluginPath = path.join(pluginFolder, pluginConfig.start);
            var plugin = require(pluginPath);
            plugin.templates = dot.process({path: pluginFolder});
            if (plugin.templates.service) console.log(plugin.templates.service.toString());
            validatePlugin(plugin, pluginFolder);
            plugin.config = configLoader.get(plugin.plugin_name); // Attach config of plugin to plugin
            console.log(plugin.config);
            allPlugins.push(plugin);
        }
    });
    Plugins.allPlugins = allPlugins;
};

Plugins.activateServices = function() {
    var server = require("./server");
    var allServices = Plugins.getAllServices();
    for (var i = 0; i < allServices.length; i++) {
        if (allServices[i].onWebsocketConnection) {
            server.addWebservice('/'+allServices[i].service_id, function(ws){
                allServices[i].onWebsocketConnection(ws);
            });
        }
    }
    return allServices;
};

// var allPlugins = loadPlugins();
// console.log(allPlugins);

Plugins.getAll = function () {
    return Plugins.allPlugins;
};

Plugins.getPlugin = function (name) {
    for (var i = 0; i < Plugins.allPlugins.length; i++) {
        if(Plugins.allPlugins[i].plugin_name === name){
            return Plugins.allPlugins[i];
        }
    }
    console.log("PLUGIN NOT FOUND:" + name);
};

Plugins.getPluginForTarget = function (target) {
    var allPlugins = Plugins.allPlugins;
    for (var i = 0; i < allPlugins.length; i++) {
        var plugin = allPlugins[i];
        if(plugin.config && plugin.config.targets){
            for (var j = 0; j < plugin.config.targets.length; j++) {
                if(plugin.config.targets[j].toLowerCase() === target.toLowerCase())
                    return plugin;
            }
        }
    }
    console.log("PLUGIN FOR TARGET NOT FOUND:" + target);
};

Plugins.getPluginDevicesByLocation = function (locations, plugin) {
    var devicesInLocation = [];
    var allDevices = configLoader.get("Devices");
    for (var prop in allDevices) {
        var deviceLocation = allDevices[prop].location;
        for (var i = 0; i < locations.length; i++) {
            if(deviceLocation.toLowerCase() === locations[i].toLowerCase())
                devicesInLocation.push(prop);
        }
        
    }
    console.log(devicesInLocation);
    return _.intersection(devicesInLocation, plugin.config.devices);
};

Plugins.getService = function (plugin_name, service_name) {
    var plugin = Plugins.getPlugin(plugin_name);
    var pluginservices = plugin.services;
    for (var i = 0; i < pluginservices.length; i++) {
        if(pluginservices[i].name === service_name){
            return pluginservices[i];
        }
    }
};

Plugins.findServiceByName = function (service_name) {
    var allServices = Plugins.getAllServices();
    for (var i = 0; i < allServices.length; i++) {
        if(allServices[i].name === service_name){
            return allServices[i];
        }
    }
    return null;
};



function generateServiceId(pluginName, serviceName){
    var service_id = pluginName+serviceName;
    return service_id.replace(/\s/g,''); // Strip whitespaces
}

/*
*   {
        plugin_name: aaa,
        name: bbb,
        service_id: aaabbb,
        services: [yoo, yeah]
        template: blubber
    }
*/
Plugins.getAllServices = function () {
    var allPlugins = Plugins.getAll();

    var allServices = [];
    for (var i = 0; i < allPlugins.length; i++) {

        var pluginservices = allPlugins[i].services;
        _(pluginservices).forEach(function fillServiceInfo(service, plugin) {
            service.plugin_name = allPlugins[i].plugin_name;
            service.service_id = generateServiceId(service.plugin_name,service.name);
            service.homescreen = sorting.getPositionForServiceId(service.service_id);
            service.plugin = allPlugins[i];
        });
        allServices = _.union(allServices, pluginservices);

    }
    allServices.sort(function(a, b) {
      return a.homescreen > b.homescreen;
    });
    return allServices;
};

Plugins.getHome = function () {
    var services = Plugins.getAllServices();
    for (var i = 0; i < services.length; i++) {
        services[i].homescreen = sorting.getPositionForServiceId(services[i].service_id);
    }
    var homeservices = _.filter(services, function(s) { return s.homescreen >= 0; });

    var sortedhomeservices = _.sortBy(homeservices, 'homescreen');
    return sortedhomeservices;
};



module.exports = Plugins;
