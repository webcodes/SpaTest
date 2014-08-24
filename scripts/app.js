requirejs.config({
	paths: {
		"text" : "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
		"ko" : "../lib",
		"templates" : "../templates",
		"fixtures" : "../fixtures",
		"plugins" : "./plugins"
		//"toastr" : "//cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.2/js/toastr.min"
	}
});
define(['plugins/router'], function(Router) {

  	var registerKoComponents = function() {
  		ko.components.register('recentprofiles', {require : 'components/recentprofiles'});
		ko.components.register('profile', {require : 'components/profile'});
		ko.components.register('searchresults', {require : 'components/searchresults'});
		ko.components.register('reports', {require : 'components/reports'});
		ko.components.register('connections', {require : 'components/connections'});
		ko.components.register('flows', {require : 'components/flows'});
  	};

  	//running a Sammy app
  	var setupRouting = function(vm) {
  		
  		//TODO: find a better encapsulation for routing. This could grow long when there are a lot of routes.
  		var rootRouter = new Router("#appRoot");
  		rootRouter.mapRoutes(
			[
				//note: there are no routes registered for non hash routes (or external htmls.)
				['get', '#/reports', function() {
					vm.componentName("reports");
				}],
				['get', '#/search/:key', function() {
					var searchKey = this.params.key;
					vm.searchItem(searchKey);
					vm.componentParams = {"search" : vm.searchItem};
					vm.componentName("searchresults");
				}],

				['get', /#\/profile\/(\d+)(\/)*/, function() {
					var profileId = this.params.splat[0];
					vm.componentParams = {"id" : profileId};
					vm.componentName("profile");
					this.trigger('loadprofilecomponents');
				}],	

				['get', '#/', function() {
					vm.componentName("recentprofiles");
				}]
			]
		).activate();

  	};
  	//fallback for IE
	$(document).ready(function() {
	    if (!("autofocus" in document.createElement("input"))) {
	      $("#header .searchfield").focus();
	    }
  	});

  	var App = function() {
		var self = this;
		this.searchItem = ko.observable();
		this.componentName = ko.observable();
		this.componentsToLoad = ko.observableArray();
		this.loadComponent = ko.computed(function() {
			return self.componentName() && self.componentName().length > 0;
		});
		this.componentParams = {};
  		this.search = function(searchform) {
			//you get back the form
			var searchField = $(searchform).find(".searchfield").val();
			console.log(searchField);
			location.hash = "/search/" + searchField;
		};
		registerKoComponents();
		setupRouting(self);
  	};

	ko.applyBindings(new App());
});