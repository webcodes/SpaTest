define(["server/profileRepository", "text!templates/recentprofiles.html", "ko/knockout.viewmodel.min"], function(repository, template, komapper){
	var setProfiles = function(profiles){
		profiles = profiles || [];
		var self = this;
		self.recentProfiles(profiles);
	};

	var viewModel = function(params) {
		var self = this; //create a closure
		this.recentProfiles = ko.observableArray([]);
		this.hasProfiles = ko.computed(function() {
			var profiles = ko.unwrap(self.recentProfiles);
			return profiles.length > 0;
		});
		this.profileUpdated = ko.observable().subscribeTo("PROFILEUPDATED", function(){
			//console.log(profile);
			repository.getRecentProfiles().done(setProfiles.bind(self));
		});

		this.selectedProfile = ko.observable();
		this.showProfile = function(profile) {
			console.log(this);
			location.hash = "/profile/" + profile.id;
		};

		repository.getRecentProfiles().done(setProfiles.bind(this));
	};

	return {viewModel : viewModel, template : template};
});