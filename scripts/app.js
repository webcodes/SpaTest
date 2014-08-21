requirejs.config({
	paths: {
		"text" : "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
		"ko" : "../lib",
		"templates" : "../templates",
		"fixtures" : "../fixtures"
		//"toastr" : "//cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.2/js/toastr.min"
	}
});
define(['plugins/router'], function(router) {

  	var registerKoComponents = function() {
  		ko.components.register('recentprofiles', {require : 'components/recentprofiles'});
		ko.components.register('profile', {require : 'components/profile'});
		ko.components.register('searchresults', {require : 'components/searchresults'});
  	};

  	//running a Sammy app
  	
  	//fallback for IE
	$(document).ready(function() {
	    if (!("autofocus" in document.createElement("input"))) {
	      $("#header .searchfield").focus();
	    }
  	});

  	var spapp = (function() {
		var self = this;
		this.searchItem = ko.observable();
		this.loadedComponent = ko.observable("");
		this.showComponent = ko.observable(false);
		this.compParam = {};
  		this.search = function(searchform) {
			//you get back the form
			var searchField = $(searchform).find(".searchfield").val();
			console.log(searchField);
			location.hash = "/search/" + searchField;
		};
		registerKoComponents();

		router.mapRoutes(
			[
				['get', '#/search/:key', function() {
					console.log(this.path); 
					var searchKey = this.params["key"];
					self.searchItem(searchKey);
					self.compParam = {"search" : self.searchItem};
					self.loadedComponent("searchresults");
					self.showComponent(!!self.searchItem());
				}],
				['get', '#/', function() {
					console.log(this.path);
					self.loadedComponent("recentprofiles");
					self.showComponent(true);
				}]
			]
		).activate();
  	})();
	

	ko.applyBindings(spapp);
});