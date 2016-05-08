
var colors = ["tile-pink","tile-purple","tile-cyan","tile-amber","tile-light-blue","tile-red","tile-indigo","tile-deep-orange","tile-light-green"];

var index = 0;
function getNext(){
    if (index == colors.length) {
        index=0;
    }
    var col = colors[index];
    index++;
    return col;
}

var service = {};
service.getNext = getNext;
module.exports = service;