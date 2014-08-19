define(["profileRepository", "text!../templates/profiles.html"], function(repository, template){
	var setProfiles = function(profiles){
		profiles = profiles || [];
		var self = this;
		self.profiles(profiles);
		// $.each(profiles, function(index, profile) {
		// 	self.profiles.push({
		// 		"id" : profile.id, 
		// 		"segmentation" : profile.segmentation,
		// 		"ips" : profile.ips,
		// 		"coper" : profile.coper,
		// 		"legalName" : profile.legalName
		// 	});
		// });
	};

	var viewModel = function(params) {
		var self = this; //create a closure
		this.profiles = ko.observableArray([]);
		this.viewDetails = ko.observable(false).subscribeTo("VIEWPROFILELIST");
		this.profileUpdated = ko.observable().subscribeTo("PROFILEUPDATED", function(profile){
			console.log(profile);
		});
		this.viewList = ko.computed(function(){
			return !self.viewDetails();
		});
		this.selectedProfile = ko.observable();
		this.showProfile = function(profile) {
			console.log(this);
			self.selectedProfile(profile);
			self.viewDetails(true);
		};
		repository.getProfiles().done(setProfiles.bind(this));
	};

	return {viewModel : viewModel, template : template};
});