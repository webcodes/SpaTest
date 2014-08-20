define(["server/profileRepository", "text!../templates/profile.html", "utils/stringutils", "utils/uiutils"], function(repository, template, stringUtils, uiUtils){
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
			var profile = {
				id : this.id,
				segmentation : this.segmentation,
				ips : this.ips,
				coper : this.coper,
				legalName : this.legalName,
			};
			repository.updateProfile(profile).done(function() {
				ko.postbox.publish("PROFILEUPDATED", profile.id);
				uiUtils.showSuccess(stringUtils.format("The profile with id {0} saved!", profile.id));
			}).fail(function(ex) {
				uiUtils.showError(stringUtils.format("An error occured : {0}", ex));
			});
		};

		var profile = ko.unwrap(param.profile);
		this.id = profile.id;
		this.segmentation = profile.segmentation;
		this.ips = profile.ips;
		this.coper = profile.coper;
		this.legalName = profile.legalName;
	};

	return {viewModel : viewModel, template : template};
});