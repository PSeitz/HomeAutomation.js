
$(function() {
    //Home-Settings
    var checkBoxSelector = "input[type='checkbox']";

    

    var list = $("ol.sortablelist");
    function sendList(){
        var sortedIDs = list.sortable( "toArray" );
        console.log(sortedIDs);
        var filtered = sortedIDs.filter(function(item) {
            return $("#"+item).find(checkBoxSelector).prop('checked');
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

    // $(checkBoxSelector).bootstrapSwitch();
    // $(checkBoxSelector).on('switchChange.bootstrapSwitch', function(event, state) {
    //     sendList(); 
    // });


});