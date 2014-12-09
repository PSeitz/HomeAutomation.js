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


/*
Copyright (c) 2012 Coding Stuff

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

For more Check us out www.coding-stuff.com
*/


// (function($){
 
//     $.fn.extend({
        
//         navResponsive: function() {
 
//             return this.each(function() {
//                 var nav = $(this);
        
//                 // s-collapse menu items
        
//                 nav.find('.nav-menu').find('li a').on('click',function(e){
//                     var ul = $(this).siblings('ul');
//                     if(ul.length){ e.preventDefault(); }
//                     if($(this).closest('nav').hasClass('s-collapse'))
//                     {
//                         ul.find('ul').hide();
//                         ul.find('a .s-collapse-trigger').removeClass('active').text('+');
//                         if(ul.is(':hidden')){ $(this).find('.s-collapse-trigger').addClass('active').text('-'); }
//                         else{ $(this).find('.s-collapse-trigger').removeClass('active').text('+'); }
//                         ul.slideToggle(100);        
//                     }   
//                 });
                
//                 /* s-collapse entire menu */
                
//                 nav.find('.s-collapse-trigger').click(function(e){
//                     e.preventDefault();
//                     var nav = $(this).siblings('.nav-menu');
//                     if(nav.is(':hidden')){ $(this).addClass('active').text('-'); }
//                     else{ $(this).removeClass('active').text('+'); } 
//                     $(this).siblings('.nav-menu').slideToggle();
//                 });
                
//                  set s-collapse based on nav size 
                
//                 var defaultWidth = 0;
//                 nav.find('.nav-menu').each(function(){
//                     defaultWidth += $(this).outerWidth();
//                 }); 
//                 if(nav.innerWidth() < defaultWidth + 150){
//                     nav.addClass('s-collapse'); 
//                     nav.find('.nav-menu').slideUp(500);
//                 }
                
//                 $(window).resize(function(){
//                     var el = nav.find('.nav-menu');
//                     if(nav.innerWidth() < defaultWidth + 150)
//                     {
//                         if(!nav.hasClass('s-collapse'))
//                         {
//                             nav.addClass('s-collapse', 300);
//                             el.find('ul').hide();
//                             el.hide();
//                             nav.find('.s-collapse-trigger').removeClass('active').text('+');
//                         }   
//                     }
//                     else
//                     {
//                         if(nav.hasClass('s-collapse'))
//                         {
//                             nav.find('.s-collapse-trigger:last').addClass('active').text('-');      
//                             nav.removeClass('s-collapse', 300);         
//                             el.find('ul').show();
//                             el.fadeIn();                    
//                         }   
//                     }
//                 });
            
//             });
//         }
//     });
     
// })(jQuery);

