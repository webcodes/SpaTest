requirejs.config({
	paths: {
		"text" : "../lib/text.2.0.12.min",
		"ko" : "../lib",
		"templates" : "../templates",
		"fixtures" : "../fixtures",
		"plugins" : "./plugins"
	}
});
define(['plugins/router', 'utils/uiutils'], function(Router, ui) {

  	var registerKoComponents = function() {
  		ko.components.register('recentprofiles', {require : 'components/recentprofiles'});
		ko.components.register('profile', {require : 'components/profile'});
		ko.components.register('searchresults', {require : 'components/searchresults'});
		ko.components.register('reports', {require : 'components/reports'});
		ko.components.register('connections', {require : 'components/connections'});
		ko.components.register('flows', {require : 'components/flows'});
		ko.components.register('floweditor', {require : 'components/floweditor'});
		ko.components.register('custidrenderer', {require : 'components/custidrenderer'});
		ko.components.register('dummycomponent', {require : 'components/dummycomponent'});
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
					vm.previous = this.app.getLocation();
					vm.searchItem(searchKey);
					vm.componentParams = {"search" : vm.searchItem};
					vm.componentName("searchresults");
				}],

				['get', /#\/profile\/(\d+)(\/)*/, function() {
					var profileId = this.params.splat[0];
					vm.componentParams = {"id" : profileId, "prev" : vm.previous};
					vm.componentName("profile");
					this.trigger('loadprofilecomponents');
				}],	

				['get', '#/', function() {
					vm.previous = this.app.getLocation();
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
		var count = 1;
		this.msg = ko.observable();
		this.createSuccess = function() {
			var msg = self.msg() || "A new message ";
			msg += count;
			count++;
			ui.showSuccess(msg);	
		};
		this.createError = function() {
			var msg = self.msg() || "A new message ";
			msg += count;
			count++;
			ui.showError(msg);	
		};
		this.createMessage = function() {
			var msg = self.msg() || "A new message ";
			msg += count;
			count++;
			ui.showMessage("info", msg);	
		};

		registerKoComponents();
		setupRouting(self);
  	};

	ko.applyBindings(new App());
});