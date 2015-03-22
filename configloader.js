var fs = require('fs');
var yaml = require('js-yaml');
// Get document, or throw exception on error
try {
    var doc = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
    console.log(doc);

    // module.exports = function (name) {
    //     if (!name) return doc;
    //     return doc[name];
    // };

    var service = {};

    service.get = function (name) {
        if (!name) return doc;
        return doc[name];
    };

    service.getTargets = function () {
        var allTargets = [];
        //Build targets
        for (var prop in doc) {
            if (doc[prop].targets) {
                allTargets = allTargets.concat(doc[prop].targets);
            }
        }
        return allTargets;
    };

    module.exports = service;

    // module.exports = doc;
} catch (e) {
    console.log(e);
}