(function(){function c(n,j){var o;j=j||{};this.trackingClick=false;this.trackingClickStart=0;this.targetElement=null;this.touchStartX=0;this.touchStartY=0;this.lastTouchIdentifier=0;this.touchBoundary=j.touchBoundary||10;this.layer=n;this.tapDelay=j.tapDelay||200;if(c.notNeeded(n)){return}function p(l,i){return function(){return l.apply(i,arguments)}}var h=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"];var m=this;for(var k=0,g=h.length;k<g;k++){m[h[k]]=p(m[h[k]],m)}if(b){n.addEventListener("mouseover",this.onMouse,true);n.addEventListener("mousedown",this.onMouse,true);n.addEventListener("mouseup",this.onMouse,true)}n.addEventListener("click",this.onClick,true);n.addEventListener("touchstart",this.onTouchStart,false);n.addEventListener("touchmove",this.onTouchMove,false);n.addEventListener("touchend",this.onTouchEnd,false);n.addEventListener("touchcancel",this.onTouchCancel,false);if(!Event.prototype.stopImmediatePropagation){n.removeEventListener=function(l,r,i){var q=Node.prototype.removeEventListener;if(l==="click"){q.call(n,l,r.hijacked||r,i)}else{q.call(n,l,r,i)}};n.addEventListener=function(q,r,l){var i=Node.prototype.addEventListener;if(q==="click"){i.call(n,q,r.hijacked||(r.hijacked=function(s){if(!s.propagationStopped){r(s)}}),l)}else{i.call(n,q,r,l)}}}if(typeof n.onclick==="function"){o=n.onclick;n.addEventListener("click",function(i){o(i)},false);n.onclick=null}}var b=navigator.userAgent.indexOf("Android")>0;var f=/iP(ad|hone|od)/.test(navigator.userAgent);var d=f&&(/OS 4_\d(_\d)?/).test(navigator.userAgent);var e=f&&(/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);var a=navigator.userAgent.indexOf("BB10")>0;c.prototype.needsClick=function(g){switch(g.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(g.disabled){return true}break;case"input":if((f&&g.type==="file")||g.disabled){return true}break;case"label":case"iframe":case"video":return true}return(/\bneedsclick\b/).test(g.className)};c.prototype.needsFocus=function(g){switch(g.nodeName.toLowerCase()){case"textarea":return true;case"select":return !b;case"input":switch(g.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return false}return !g.disabled&&!g.readOnly;default:return(/\bneedsfocus\b/).test(g.className)}};c.prototype.sendClick=function(h,i){var g,j;if(document.activeElement&&document.activeElement!==h){document.activeElement.blur()}j=i.changedTouches[0];g=document.createEvent("MouseEvents");g.initMouseEvent(this.determineEventType(h),true,true,window,1,j.screenX,j.screenY,j.clientX,j.clientY,false,false,false,false,0,null);g.forwardedTouchEvent=true;h.dispatchEvent(g)};c.prototype.determineEventType=function(g){if(b&&g.tagName.toLowerCase()==="select"){return"mousedown"}return"click"};c.prototype.focus=function(g){var h;if(f&&g.setSelectionRange&&g.type.indexOf("date")!==0&&g.type!=="time"&&g.type!=="month"){h=g.value.length;g.setSelectionRange(h,h)}else{g.focus()}};c.prototype.updateScrollParent=function(h){var i,g;i=h.fastClickScrollParent;if(!i||!i.contains(h)){g=h;do{if(g.scrollHeight>g.offsetHeight){i=g;h.fastClickScrollParent=g;break}g=g.parentElement}while(g)}if(i){i.fastClickLastScrollTop=i.scrollTop}};c.prototype.getTargetElementFromEventTarget=function(g){if(g.nodeType===Node.TEXT_NODE){return g.parentNode}return g};c.prototype.onTouchStart=function(i){var g,j,h;if(i.targetTouches.length>1){return true}g=this.getTargetElementFromEventTarget(i.target);j=i.targetTouches[0];if(f){h=window.getSelection();if(h.rangeCount&&!h.isCollapsed){return true}if(!d){if(j.identifier&&j.identifier===this.lastTouchIdentifier){i.preventDefault();return false}this.lastTouchIdentifier=j.identifier;this.updateScrollParent(g)}}this.trackingClick=true;this.trackingClickStart=i.timeStamp;this.targetElement=g;this.touchStartX=j.pageX;this.touchStartY=j.pageY;if((i.timeStamp-this.lastClickTime)<this.tapDelay){i.preventDefault()}return true};c.prototype.touchHasMoved=function(g){var i=g.changedTouches[0],h=this.touchBoundary;if(Math.abs(i.pageX-this.touchStartX)>h||Math.abs(i.pageY-this.touchStartY)>h){return true}return false};c.prototype.onTouchMove=function(g){if(!this.trackingClick){return true}if(this.targetElement!==this.getTargetElementFromEventTarget(g.target)||this.touchHasMoved(g)){this.trackingClick=false;this.targetElement=null}return true};c.prototype.findControl=function(g){if(g.control!==undefined){return g.control}if(g.htmlFor){return document.getElementById(g.htmlFor)}return g.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")};c.prototype.onTouchEnd=function(i){var k,j,h,m,l,g=this.targetElement;if(!this.trackingClick){return true}if((i.timeStamp-this.lastClickTime)<this.tapDelay){this.cancelNextClick=true;return true}this.cancelNextClick=false;this.lastClickTime=i.timeStamp;j=this.trackingClickStart;this.trackingClick=false;this.trackingClickStart=0;if(e){l=i.changedTouches[0];g=document.elementFromPoint(l.pageX-window.pageXOffset,l.pageY-window.pageYOffset)||g;g.fastClickScrollParent=this.targetElement.fastClickScrollParent}h=g.tagName.toLowerCase();if(h==="label"){k=this.findControl(g);if(k){this.focus(g);if(b){return false}g=k}}else{if(this.needsFocus(g)){if((i.timeStamp-j)>100||(f&&window.top!==window&&h==="input")){this.targetElement=null;return false}this.focus(g);this.sendClick(g,i);if(!f||h!=="select"){this.targetElement=null;i.preventDefault()}return false}}if(f&&!d){m=g.fastClickScrollParent;if(m&&m.fastClickLastScrollTop!==m.scrollTop){return true}}if(!this.needsClick(g)){i.preventDefault();this.sendClick(g,i)}return false};c.prototype.onTouchCancel=function(){this.trackingClick=false;this.targetElement=null};c.prototype.onMouse=function(g){if(!this.targetElement){return true}if(g.forwardedTouchEvent){return true}if(!g.cancelable){return true}if(!this.needsClick(this.targetElement)||this.cancelNextClick){if(g.stopImmediatePropagation){g.stopImmediatePropagation()}else{g.propagationStopped=true}g.stopPropagation();g.preventDefault();return false}return true};c.prototype.onClick=function(g){var h;if(this.trackingClick){this.targetElement=null;this.trackingClick=false;return true}if(g.target.type==="submit"&&g.detail===0){return true}h=this.onMouse(g);if(!h){this.targetElement=null}return h};c.prototype.destroy=function(){var g=this.layer;if(b){g.removeEventListener("mouseover",this.onMouse,true);g.removeEventListener("mousedown",this.onMouse,true);g.removeEventListener("mouseup",this.onMouse,true)}g.removeEventListener("click",this.onClick,true);g.removeEventListener("touchstart",this.onTouchStart,false);g.removeEventListener("touchmove",this.onTouchMove,false);g.removeEventListener("touchend",this.onTouchEnd,false);g.removeEventListener("touchcancel",this.onTouchCancel,false)};c.notNeeded=function(h){var g;var j;var i;if(typeof window.ontouchstart==="undefined"){return true}j=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1];if(j){if(b){g=document.querySelector("meta[name=viewport]");if(g){if(g.content.indexOf("user-scalable=no")!==-1){return true}if(j>31&&document.documentElement.scrollWidth<=window.outerWidth){return true}}}else{return true}}if(a){i=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);if(i[1]>=10&&i[2]>=3){g=document.querySelector("meta[name=viewport]");if(g){if(g.content.indexOf("user-scalable=no")!==-1){return true}if(document.documentElement.scrollWidth<=window.outerWidth){return true}}}}if(h.style.msTouchAction==="none"){return true}return false};c.attach=function(h,g){return new c(h,g)};if(typeof define=="function"&&typeof define.amd=="object"&&define.amd){define(function(){return c})}else{if(typeof module!=="undefined"&&module.exports){module.exports=c.attach;module.exports.FastClick=c}else{window.FastClick=c}}}());
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

