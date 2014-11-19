function sendRequest(url, onsuccess, onerror) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

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