var harmony = require('harmonyhubjs-client');

var config = require('../../configloader')("Harmony Hub");

// harmony(config.ip)
// .then(function(harmonyClient) {
//     harmonyClient.isOff()
//     .then(function(off) {
//         if(off) {
//             console.log('Currently off. Turning TV on.');

//             harmonyClient.getActivities()
//             .then(function(activities) {
//                 activities.some(function(activity) {
//                     console.log(activity.label);
//                     if(activity.label === 'FERNSEHEN') {
//                         var id = activity.id;
//                         harmonyClient.startActivity(id);
//                         harmonyClient.end();
//                         return true;
//                     }
//                     return false;
//                 });
//             });
//         } else {
//             console.log('Currently on. Turning TV off');
//             harmonyClient.turnOff();
//             harmonyClient.end();
//         }
//     });
// });



exports.getName = function(){
    return "Harmony Hub";
};

function createfunc(service) {
    return function() {
        if (service.action == "off") {
             harmony(config.ip)
            .then(function(harmonyClient) {
                console.log('Turning TV off');
                harmonyClient.turnOff();
                harmonyClient.end();
            });
        }else{
            harmony(config.ip)
            .then(function(harmonyClient) {
                harmonyClient.getActivities()
                .then(function(activities) {
                    activities.some(function(activity) {
                        console.log(activity.label);
                        if(activity.label === service.activity) {
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
    };
}

exports.services = function(){
    var actions = [];
    // actions.push({
    //     name: "Fernsehen",
    //     action : function(){
    //         harmony(config.ip)
    //         .then(function(harmonyClient) {
    //             harmonyClient.getActivities()
    //             .then(function(activities) {
    //                 activities.some(function(activity) {
    //                     console.log(activity.label);
    //                     if(activity.label === 'FERNSEHEN') {
    //                         var id = activity.id;
    //                         harmonyClient.startActivity(id);
    //                         harmonyClient.end();
    //                         return true;
    //                     }
    //                     return false;
    //                 });
    //             });
    //         });
    //     }
    // });

    // actions.push({
    //     name: "Fernseh Aus",
    //     action : function(){
    //         harmony(config.ip)
    //         .then(function(harmonyClient) {
    //             console.log('Turning TV off');
    //             harmonyClient.turnOff();
    //             harmonyClient.end();
    //         });
    //     }
    // });

    for (var prop in config.services) {
        var deviceName = config.services[prop];
        actions.push({
            name: prop,
            action : createfunc(config.services[prop])
        });
    }
    return actions;
};

