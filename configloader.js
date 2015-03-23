var fs = require('fs');
var yaml = require('js-yaml');
var _ = require('lodash');
// Get document, or throw exception on error
try {
    var doc = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
    console.log(doc);

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

    module.exports = service;

} catch (e) {
    console.log(e);
}