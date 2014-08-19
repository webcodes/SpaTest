define(["profileRepository", "text!../templates/profile.html"], function(repository, template){
	var setProfiles = function(profile){
		profile = profile || {};
		var self = this;
		self.profiles(profile);
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

	var viewModel = function(param) {
		var self = this; //create a closure
		this.showList = function(){
			ko.postbox.publish("VIEWPROFILELIST", false);
		};

		this.save = function() {
			ko.postbox.publish("PROFILEUPDATED", this);
		};

		var profile = ko.unwrap(param.profile);
		this.id = profile.id;
		this.segmentation = profile.segmentation;
		this.ips = profile.ips;
		this.coper = profile.coper;
		this.legalName = profile.legalName;
		// this.viewDetails = ko.observable(false);
		// this.viewList = ko.computed(function(){
		// 	return !self.viewDetails();
		// });
		// this.selectedProfile = ko.observable();
		// this.showProfile = function(profile) {
		// 	console.log(this);
		// 	self.selectedProfile(profile);
		// 	self.viewDetails(true);
		// };
		// repository.getProfiles().done(setProfiles.bind(this));
	};

	return {viewModel : viewModel, template : template};
});