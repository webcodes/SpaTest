requirejs.config({
	paths: {
		"text" : "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
		"ko" : "../lib",
		"templates" : "../templates",
		"fixtures" : "../fixtures"
		//"toastr" : "//cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.2/js/toastr.min"
	}
});
define(function(require) {
	//fallback for IE
	$(document).ready(function() {
	    if (!("autofocus" in document.createElement("input"))) {
	      $("#header .searchfield").focus();
	    }
  	});

	ko.components.register('recentprofiles', {require : 'components/recentprofiles'});
	ko.components.register('profile', {require : 'components/profile'});
	ko.components.register('searchresults', {require : 'components/searchresults'});
	
	this.search = function(searchform){
		//you get back the form
		var searchField = $(searchform).find(".searchfield").val();
		console.log(searchField);
		this.searchItem(searchField);
	};

	this.searchItem = ko.observable();
	ko.applyBindings();
});