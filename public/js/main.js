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


if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}



$(function() {
    // $("ol.sortablelist").sortable({
    //     group: 'sortablelist',
    //     onDrag: function($item, position) {
    //         $item.css({
    //             left: position.left - adjustment.left,
    //             top: position.top - adjustment.top
    //         });
    //     }
    // });

    $("input[type='checkbox']").bootstrapSwitch();

    var list = $("ol.sortablelist");
    function sendList(){
        var sortedIDs = list.sortable( "toArray" );
        console.log(sortedIDs);
        var filtered = sortedIDs.filter(function(item) {
            return $("#"+item).find("input[type='checkbox']").prop('checked');
        });
        console.log(filtered);
        $.post("/newhomeorder", { "list": filtered});
    }
    
    list.sortable({
        stop: function( event, ui ) {
            sendList(); 
        },
        handle: ".handle"
    });

    // $( "[type=checkbox]" )
    $('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
        sendList(); 
    });
  //   $( "input[type='checkbox']" ).change(function() {
  // // Check input( $( this ).val() ) for validity here
  //       console.log($( this ).prop('checked'));
  //   });


});