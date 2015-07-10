var fs = require('fs');
var yaml = require('js-yaml');
var _ = require('lodash');
// Get document, or throw exception on error
try {
    var doc = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));

    

    var service = {};

    service.get = function (name) {
        if (!name) return doc;
        return doc[name];
    };

    service.getAllTargets = function () {
        var allTargets = [];
        //Build targets
        for (var prop in doc) {
            if (doc[prop].targets) {
                allTargets = allTargets.concat(doc[prop].targets);
            }
        }
        return allTargets;
    };

    service.getAllCommands = function () {
        var allCommands = [];
        //Build coomands
        for (var prop in doc) {
            if (doc[prop].commands) {
                allCommands = allCommands.concat(doc[prop].commands);
            }
        }
        allCommands = _.uniq(allCommands);
        return allCommands;
    };


    service.getAllLocations = function () {
        return service.get("Rooms");
    };

    service.writeBack = function (config) {
        var output = yaml.dump(config, {
            indent: 4,
            flowLevel: 3,
            styles: {
                '!!int': 'hexadecimal',
                '!!null': 'camelcase'
            }
        });
        fs.writeFileSync('config.yml', output, 'utf8');
        doc = config;
    };

    module.exports = service;

} catch (e) {
    console.log(e);
}