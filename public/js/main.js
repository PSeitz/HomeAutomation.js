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

    // $("input").bootstrapSwitch();

    var group = $("ol.sortablelist").sortable({
        group: 'sortablelist',
        pullPlaceholder: false,
        placeholder: '<li class="placeholder list-group-item">Drop it</li>',
        // animation on drop
        onDrop: function(item, targetContainer, _super) {
            // var clonedItem = $('<li/>').css({
            //     height: 0
            // });
            // item.before(clonedItem);
            // clonedItem.animate({
            //     'height': item.height()
            // });

            // item.animate(clonedItem.position(), function() {
            //     clonedItem.detach();
            //     _super(item);
            // });

            var data = group.sortable("serialize").get();
            var jsonString = JSON.stringify(data, null, ' ');

            var filtered = data[0].filter(function(item) {
                return item.id;
            });


            var order = filtered.map(function(item) {
                return item.id;
            });
            console.log(order);

            // $item.removeClass("dragged").removeAttr("style");
            // $("body").removeClass("dragging");
            _super(item, targetContainer);
        },

        // set item relative to cursor position
        onDragStart: function($item, container, _super) {
            var offset = $item.offset(),
                pointer = container.rootGroup.pointer;

            adjustment = {
                left: pointer.left - offset.left,
                top: pointer.top - offset.top
            };

            // $item.css({
            //     height: "80px",
            //     width: $item.width()
            // });
            // $item.addClass("dragged");
            // $("body").addClass("dragging");

            _super($item, container);

        },
        onDrag: function($item, position) {
            $item.css({
                left: position.left - adjustment.left,
                top: position.top - adjustment.top
            });
        }
    });

});