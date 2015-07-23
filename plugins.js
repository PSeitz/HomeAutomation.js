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

var service = {};

service.loadPlugins = function() {
    var allPlugins = [];
    fs.readdirSync(pluginsFolder).forEach(function(file) {
        var pluginFolder = path.join(__dirname,pluginsFolder, file);
        var pathToConfig = path.join(pluginFolder, ".homeauto.json"); //if there is a homeauto.json, there is a plugin
        if (fs.existsSync(pathToConfig)) {
            var pluginConfig = require(pathToConfig);
            var pluginPath = path.join(pluginFolder, pluginConfig.start);
            var plugin = require(pluginPath);
            plugin.templates = dot.process({path: pluginFolder});
            // if (plugin.templates.service) console.log(plugin.templates.service.toString());
            validatePlugin(plugin, pluginFolder);
            plugin.config = configLoader.get(plugin.plugin_name); // Attach config of plugin to plugin
            allPlugins.push(plugin);
        }
    });
    service.allPlugins = allPlugins;
};

service.activateServices = function() {
    var server = require("./server");
    var allServices = service.getAllServices();
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

service.getAll = function () {
    if (!service.allPlugins) {
        service.loadPlugins();
    }
    return service.allPlugins;
};

service.getPlugin = function (name) {
    for (var i = 0; i < service.getAll().length; i++) {
        if(service.getAll()[i].plugin_name === name){
            return service.getAll()[i];
        }
    }
    console.log("PLUGIN NOT FOUND:" + name);
};

service.getPluginForTarget = function (target) {
    var allPlugins = service.getAll();
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

service.getPluginDevicesByLocation = function (locations, plugin) {
    var devicesInLocation = [];
    var allDevices = configLoader.get("Devices");
    for (var prop in allDevices) {
        var deviceLocation = allDevices[prop].location;
        for (var i = 0; i < locations.length; i++) {
            if(deviceLocation.toLowerCase() === locations[i].toLowerCase())
                devicesInLocation.push(prop);
        }
        
    }
    return _.intersection(devicesInLocation, plugin.config.devices);
};

service.getAllPluginDevices = function (plugin) {
    if (!plugin) {
        return;   
    }
    return plugin.config.devices;
};

service.getService = function (plugin_name, service_name) {
    var plugin = service.getPlugin(plugin_name);
    var pluginservices = plugin.services;
    for (var i = 0; i < pluginservices.length; i++) {
        if(pluginservices[i].name === service_name){
            return pluginservices[i];
        }
    }
};

service.findServiceByName = function (service_name) {
    var allServices = service.getAllServices();
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
service.getAllServices = function () {
    var allPlugins = service.getAll();
    var allServices = [];
    for (var i = 0; i < allPlugins.length; i++) {
        var pluginservices = allPlugins[i].services;
        for (var prop in pluginservices) {
            var pluginservice = pluginservices[prop];
            pluginservice.plugin_name = allPlugins[i].plugin_name;
            pluginservice.service_id = generateServiceId(pluginservice.plugin_name,pluginservice.name);
            pluginservice.homescreen = sorting.getPositionForServiceId(pluginservice.service_id);
            pluginservice.plugin = allPlugins[i];
        }
        allServices = _.union(allServices, pluginservices);

    }
    allServices.sort(function(a, b) {
      return a.homescreen > b.homescreen;
    });
    return allServices;
};

service.getHome = function () {
    var services = service.getAllServices();
    for (var i = 0; i < services.length; i++) {
        services[i].homescreen = sorting.getPositionForServiceId(services[i].service_id);
    }
    var homeservices = _.filter(services, function(s) { return s.homescreen >= 0; });

    var sortedhomeservices = _.sortBy(homeservices, 'homescreen');
    return sortedhomeservices;
};

service.loadPlugins();
// service.activateServices();

module.exports = service;
