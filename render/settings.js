(function(){function settings(it
/**/) {
var out='<ol class="sortablelist list-group"> ';var arr1=it.services;if(arr1){var service,index=-1,l1=arr1.length-1;while(index<l1){service=arr1[index+=1];out+=' <li class="item item-checkbox" data-id="'+(service.service_id)+'" id="'+(service.service_id)+'"> <label class="checkbox"> <input type="checkbox" ';if(service.homescreen !== -1){out+=' checked ';}out+='> </label> '+(service.name)+' <span class="icon ion-drag pull-right handle"></span> </li> <!--  <li class="list-group-item" data-id="'+(service.service_id)+'" id="'+(service.service_id)+'"> <span class="handle"> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </span> <p class="pull-right"> <input type="checkbox" ';if(service.homescreen !== -1){out+=' checked ';}out+=' > </p> '+(service.name)+' </li> --> ';} } out+=' </ol><!--  <script src="/js/jquery-ui.min.js"></script><script src="/js/jquery.ui.touch-punch.min.js"></script><script src="/js/bootstrap-switch.js"></script>--><script src="/build/all_settings.js"></script>';return out;
}var itself=settings, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {_page.render=_page.render||{};_page.render['settings']=itself;}}());