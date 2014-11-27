
var SortOrder = function (){};

var service_position = {
	WolNasOn: 5,
	WolHTPCOn: 4,
	LightsAllOff: 1,
	LightsAllOn: 6,
	LightsWohnzimmer: 3,
	LightsSchlafzimmer: 4,
	LightsArbeitszimmer: 2
};

SortOrder.prototype.getPositionForServiceId = function (service_id) {
	return service_position[service_id] || -1;
};

var sortorder = new SortOrder();
module.exports = sortorder;
