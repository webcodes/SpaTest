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
	};

//running a Sammy app
  	var setupRouting = function(vm) {
  		
  		//TODO: find a better encapsulation for routing. This could grow long when there are a lot of routes.
		var profileRouter = new Router("#profileRoot");
		//Add the routes as well.
  		profileRouter.mapRoutes(
			[
				//note: there are no routes registered for non hash routes (or external htmls.)

				['get', '#/connections', function() {
					console.log(this.path);
					var connComponent = {};
					connComponent.componentName = "connections";
					connComponent.params = {"profileId" : vm.profileVm().id()};
					vm.componentsToLoad([connComponent]);
				}],

				['get', '#/flows', function() {
					console.log(this.path);
					var flowComponent = {};
					flowComponent.componentName = "flows";
					flowComponent.params = {"profileId" : vm.profileVm().id()};
					vm.componentsToLoad([flowComponent]);
				}],

  				//TODO: Create a sammy router here for showing components of a profile - connections, flows, risk matrix etc.
				['get', '', function() {
					console.log(this.path);
					vm.componentsToLoad([]);
				}]
			]
		)
		.activate("/#/");

		//$("#profileRoot").data(profileRouter);

  	};

	var viewModel = function(param) {
		var self = this; //create a closure
		var params = ko.unwrap(param);
		var id = ko.unwrap(param.id);
		this.profileVm = ko.observable();
		this.componentsToLoad = ko.observableArray();
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

		repository.getProfileById(id).done(setProfile.bind(this));	

		setupRouting(self);
	};

	return {viewModel : viewModel, template : template};
});