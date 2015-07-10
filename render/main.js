(function(){function main(it
/**/) {
var out=' <div class="list"> ';var arr1=it.services;if(arr1){var service,index=-1,l1=arr1.length-1;while(index<l1){service=arr1[index+=1];out+='  ';if(service.plugin.templates && service.plugin.templates.service){out+=' '+(service.plugin.templates.service(service))+' ';}else{out+=' <a onclick="sendRequest(\''+(service.service_id)+'\')" href="#" class="item selectable"> '+(service.name)+' </a> ';}out+=' ';} } out+=' </div>';return out;
}var itself=main, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {_page.render=_page.render||{};_page.render['main']=itself;}}());