var _=require('lodash');
var fs = require('fs');
var path = require('path');
var sorting = require("./homescreensortorder");

var pluginsFolder = './plugins';

function getPlugins() {
    var allPlugins = [];
    fs.readdirSync(pluginsFolder).forEach(function(file) {
        var isDir = fs.statSync(path.join(pluginsFolder, file)).isDirectory();
        console.log(file);
        var pathToConfig = path.join(__dirname, pluginsFolder, file, ".homeauto.json");
        console.log(pathToConfig);
        if (fs.existsSync(pathToConfig)) {
            // return true;
            var pluginConfig = require(pathToConfig);
            var plugin = require(path.join(__dirname,pluginsFolder, file, pluginConfig.start));
            allPlugins.push(plugin);
        }
    });
    return allPlugins;
}


var controlLights = require("./plugins/ControlHue/controllights");
var wol = require("./plugins/Wol/wol");

var Plugins = function (){
};

var loadedPlugins = getPlugins();
var all = [];
console.log(loadedPlugins);
for (var i = 0; i < loadedPlugins.length; i++) {
    console.log(loadedPlugins[i].services());
    all.push({
        plugin_name : loadedPlugins[i].getName(),
        services : loadedPlugins[i].services()
    });
}

Plugins.prototype.getAll = function () {
    return all;
};


function generateServiceId(pluginName, serviceName){
    var service_id = pluginName+serviceName;
    return service_id.replace(/\s/g,''); // Strip whitespaces
}

Plugins.prototype.getAllServices = function () {
    var allPlugins = this.getAll();
    var allServices = [];
    for (var i = 0; i < allPlugins.length; i++) {
        
        var pluginservices = allPlugins[i].services;

        _(pluginservices).forEach(function(service) {
            service.plugin_name = allPlugins[i].plugin_name;
            service.service_id = generateServiceId(service.plugin_name,service.name);
            service.homescreen = sorting.getPositionForServiceId(service.service_id);
        });

        allServices = _.union(allServices, pluginservices);

    }
    return allServices;
};

Plugins.prototype.getHome = function () {
    var services = this.getAllServices();
    for (var i = 0; i < services.length; i++) {
        services[i].homescreen = sorting.getPositionForServiceId(services[i].service_id);
    }
    var homeservices = _.filter(services, function(s) { return s.homescreen >= 0; });

    var sortedhomeservices = _.sortBy(homeservices, 'homescreen');
    return sortedhomeservices;
};




var plugins = new Plugins();

module.exports = plugins;
