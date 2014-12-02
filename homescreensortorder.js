var fs = require('fs');

var outputFilename = 'sortorder.json';

// var service_position = {
// 	WolNasOn: 5,
// 	WolHTPCOn: 4,
// 	LightsAllOff: 1,
// 	LightsAllOn: -1,
// 	LightsWohnzimmer: 3,
// 	LightsSchlafzimmer: 4,
// 	LightsArbeitszimmer: 2
// };

service_position = {} ;
try{
	service_position = require('./'+outputFilename);
}catch(e){

}

function saveOrder(list){
	fs.writeFile(outputFilename, JSON.stringify(list, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved to " + outputFilename);
	    }
	}); 
}

var SortOrder = function (){};

SortOrder.prototype.getPositionForServiceId = function (service_id) {
	return service_position[service_id] || -1;
};

SortOrder.prototype.setPositions = function (service_ids) {
	service_position = {};
	for (var i = 0; i < service_ids.length; i++) {
		service_position[service_ids[i]] = i+1;
	}
	saveOrder(service_position);
};

var sortorder = new SortOrder();
module.exports = sortorder;