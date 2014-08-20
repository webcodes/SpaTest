define(['server/profileRepository', 'text!templates/searchresults.html'], function(profileRepository, searchTemplate) {
	
	var setResults = function(matchingProfiles) {
		matchingProfiles = matchingProfiles || [];
		this.searchResults(matchingProfiles);
		this.searching(false);
	};
	var vm = function(params) {
		var searchParams = ko.unwrap(params);
		if (searchParams && ko.isObservable(searchParams.search)) {
			searchParams.search.subscribe(function(newValue) {
				console.log("Value changed. Now search again using " + newValue);
			});
		}
		var searchValue = searchParams && ko.unwrap(searchParams.search);
		var self = this;
		this.searching = ko.observable(true);
		this.searchResults = ko.observableArray([]);
		this.hasResults = ko.computed(function() {
			var results = ko.unwrap(self.searchResults) || [];
			return results.length > 0; 
		});
		this.showInitial = ko.computed(function() {
			var searching = ko.unwrap(self.searching);
			if (searching) {
				return false;
			}
			else {
				return !self.hasResults();
			}
		});
		if(searchValue) {
			//search profiles
			profileRepository.searchProfiles(searchValue).done(setResults.bind(this));
		}
	};
	return {
		viewModel : vm, 
		template : searchTemplate
	};
});