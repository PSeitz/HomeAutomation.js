var wol = require('wake_on_lan');

var omv ='bc:5f:f4:cd:e0:3b';
var htpc = 'BC-5F-F4-84-D7-B7';

exports.wakeNas = function(){
    wol.wake(omv);
};

exports.wakeHTPC = function(){
    wol.wake(htpc);
};

if (process.argv[2]) {
    var method = process.argv[2];
    if (true) {};
    exports[method]();
}else{
  console.log("Choose on of these options");
  for (var method in exports) {
    if (typeof exports[method] === 'function'){
      console.log(method);
    } 
  }
}

exports.services = function(){
    return [{
        action : exports.wakeNas,
        name: "Nas On",
        homescreen: 3
    },{
        action : exports.wakeHTPC,
        name: "HTPC On",
        homescreen: -1
    }];
};
