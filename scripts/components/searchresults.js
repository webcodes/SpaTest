define(['server/profileRepository', 'server/connectionRepository', 'text!templates/searchresults.html'], function(profileRepo, connRepo, searchTemplate) {
	
	var setResults = function(matchingProfiles, matchingConns) {
		matchingProfiles = matchingProfiles || [];
		matchingConns = matchingConns || [];
		this.searchResults({profiles : matchingProfiles, connections : matchingConns});
		this.searching(false);
	};

	var subscribeToSearchParameterChange = function(searchParams, self) {
		//passing an observable as a parameter to a component binding does not automatically reevaluate the
		//whole binding when the value of that observable changes. 
		//so subscribe to a change in the value of that observable within the component
		
		if (searchParams && searchParams.search && ko.isObservable(searchParams.search)) {
			self.searchKeyComputed = ko.computed(function(){
				self.searching(true);
				var newValue = searchParams.search()
				console.log("Value changed. Now search again using " + newValue);
				if(newValue) {
					$.when(profileRepo.searchProfiles(newValue), connRepo.searchConnections(newValue))
					.done(setResults.bind(self));
				}
			});
			// searchParams.search.subscribe(function(newValue) {
			// 	self.searching(true);
			// 	console.log("Value changed. Now search again using " + newValue);
			// 	if(newValue) {
			// 		//search profiles
			// 		$.when(profileRepo.searchProfiles(newValue), connRepo.searchConnections(newValue))
			// 		.done(setResults.bind(self));
			// 	}
			// });
		}
	}
	var viewModel = function(params) {
		var self = this;
		var searchParams = ko.unwrap(params);
		var searchValue = searchParams && ko.unwrap(searchParams.search);
		this.tabs = ['Profiles', 'Connections'];
		this.visibleTab = ko.observable('Profiles');
		this.searching = ko.observable(true);
		subscribeToSearchParameterChange(searchParams,self);
		this.searchResults = ko.observable();
		this.hasResults = ko.computed(function() {
			var result = ko.unwrap(self.searchResults);
			return (result && (result.profiles.length > 0 || result.connections.length > 0));
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
			$.when(profileRepo.searchProfiles(searchValue), connRepo.searchConnections(searchValue))
					.done(setResults.bind(this));
		}
		this.showTab = function(tabName) {
			self.visibleTab(tabName);
		};
		this.showProfile = function(){
			console.log(this);
			location.hash = "/profile/" + this.id;
		}
	};
	return {
		viewModel : viewModel, 
		template : searchTemplate
	};
});