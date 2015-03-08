(function(){function index1(it) {
var out=' <div class="list"> ';var arr1=it.services;if(arr1){var service,index=-1,l1=arr1.length-1;while(index<l1){service=arr1[index+=1];out+='  <a onclick="sendRequest(\''+(service.service_id)+'\')" href="#" class="item selectable"> '+(service.name)+' </a> <!-- <a class="item item-icon-left item-icon-right" href="#"> <i class="icon ion-chatbubble-working"></i> '+(service.name)+' <i class="icon ion-ios7-telephone-outline"></i> </a> --> ';} } out+=' </div>';return out;
}var itself=index1, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {_page.render=_page.render||{};_page.render['index1']=itself;}}());