function sendRequest(url, type, onsuccess, onerror) {
    type = type || 'GET';
    var request = new XMLHttpRequest();
    request.open(type, url, true);

    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            if (onsuccess) onsuccess(this.response);
        } else {
            if (onerror) onerror(this.status);
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        if (onerror) onerror();
    };

    request.send();
}

function websocket(servicepath, onmessage, onopen){

    var ws = new WebSocket("ws://localhost:80/"+servicepath);
    ws.onopen = function() {
        // Web Socket is connected, send data using send()
        // ws.send("Message to send");
        // alert("Message is sent...");
        if (onopen) onopen(ws);
    };
    ws.onmessage = function(evt) {
        var received_msg = evt.data;
        if(onmessage)onmessage(evt);
    };
    ws.onclose = function() {
        // websocket is closed.
        // alert("Connection is closed...");
    };

}


if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

