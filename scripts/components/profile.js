define(["server/profileRepository", 
	"text!../templates/profile.html", 
	"utils/stringutils", 
	"utils/uiutils",
	"plugins/router"], 
	function(repository, template, stringUtils, uiUtils, Router){
	
	var setProfile = function(profile){
		profile = profile || {};
		var self = this;
		self.profileVm(ko.viewmodel.fromModel(profile));

		//initial
  		console.log("Initial load of components on first direct url access");
  		loadComponents(self, location.href);
	};

	var extractBaseUrl = function() {
		var rex = /(.+\#\/profile\/\d+)(.*)/;
		var matches = location.href.match(rex);
		return matches[1];
	};
	var getComponentLinks = function(self) {
		return [{
			title : "Connections",
			link : self.baseUrl + "/#/connections"
		},
		{
			title : "Flows",
			link : self.baseUrl + "/#/flows"	
		}];
	};

	var loadComponents = function(vm, url) {
		if (/\#\/connections/.test(url)) {
				var connComponent = {};
				connComponent.componentName = "connections";
				connComponent.componentParams = {"profileId" : vm.profileVm().id()};
				vm.componentsToLoad([connComponent]);
  			} 
		else if (/\#\/flows/.test(url)) {
			var flowComponent = {};
			flowComponent.componentName = "flows";
			flowComponent.componentParams = {"profileId" : vm.profileVm().id()};
			vm.componentsToLoad([flowComponent]);
		}
		else {
			vm.componentsToLoad([]);
		}

	};
//running a Sammy app
  	var setupRouting = function(vm) {

  		var router = new Router("#appRoot");
  		router.bind("loadprofilecomponents",function(e, data) {
  			loadComponents(vm, location.href)
  		});

  		//Tried to have nested router. Somehow disposing sammy and having it listen on second creation is not working.
  		//So the above solution to have a single sammy router and listening to a sammy event to decide on what profile components to load.

		//var profileRouter = new Router("#profileRoot");
		/*if (profileRouter.isRunning()) {
			return;
		}
		//Add the routes as well.
  		profileRouter.mapRoutes(
			[
				//note: there are no routes registered for non hash routes (or external htmls.)

				['get', '/#/connections', function() {
					console.log(this.path);
					var connComponent = {};
					connComponent.componentName = "connections";
					connComponent.componentParams = {"profileId" : vm.profileVm().id()};
					vm.componentsToLoad([connComponent]);
				}],

				['get', '/#/flows', function() {
					console.log(this.path);
					var flowComponent = {};
					flowComponent.componentName = "flows";
					flowComponent.componentParams = {"profileId" : vm.profileVm().id()};
					vm.componentsToLoad([flowComponent]);
				}],

  				//TODO: Create a sammy router here for showing components of a profile - connections, flows, risk matrix etc.
	
				['get', '/#/profile/:key', function() {
					console.log(this.path);
					vm.componentsToLoad([]);
				}]
			]
		)
		.activate();
		vm.router = profileRouter;*/
  	};

	var viewModel = function(param) {
		var self = this; //create a closure
		var params = ko.unwrap(param);
		var id = ko.unwrap(param.id);

		this.baseUrl = extractBaseUrl();
		this.profileVm = ko.observable();
		this.componentsToLoad = ko.observableArray();
		this.navLinks = getComponentLinks(this);

		//make sure your profileid is a number
		id = Number(id, 10);
		if (isNaN(id)) {
			uiUtils.showError("The profile id supplied is not a valid number.");
			return;
		}
		
		this.goBack = function(){
			history.back();
		};

		this.save = function() {
			var profile = ko.viewmodel.toModel(this);
			repository.updateProfile(profile).done(function() {
				ko.postbox.publish("PROFILEUPDATED", profile.id);
				uiUtils.showSuccess(stringUtils.format("The profile with id {0} saved!", profile.id));
			}).fail(function(ex) {
				uiUtils.showError(stringUtils.format("An error occured : {0}", ex));
			});
		};

		this.dispose = function() {
			console.log("Disposing profile View Model");
			//TODO: dispose any computed, manual subscription, widget bindings here...
		};
		repository.getProfileById(id).done(setProfile.bind(this));	

		setupRouting(self);
	};

	return {viewModel : viewModel, template : template};
});