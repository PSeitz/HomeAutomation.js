var fs = require('fs');
var yaml = require('js-yaml');
// Get document, or throw exception on error
try {
    var doc = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
    console.log(doc);


    module.exports = function (name) {
        if (!name) return doc;
        return doc[name];
    };


    // module.exports = doc;
} catch (e) {
    console.log(e);
}