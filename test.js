var harmony = require('harmonyhubjs-client');


var ip = '192.168.0.32';

function turnOn(activityName) {
    harmony(ip)
    .then(function(harmonyClient) {
        harmonyClient.getActivities()
        .then(function(activities) {
            activities.some(function(activity) {
                // console.log(activity.label);
                if(activity.label.toLowerCase() === activityName.toLowerCase()) {
                    var id = activity.id;
                    harmonyClient.startActivity(id);
                    harmonyClient.end();
                    return true;
                }
                return false;
            });
        });
    });
}

function turnOff() {
    harmony(ip)
    .then(function(harmonyClient) {
        console.log('Turning TV off');
        harmonyClient.turnOff();
        harmonyClient.end();
    });
}
// turnOff();
turnOn('Fernsehen');