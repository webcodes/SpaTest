define(["server/flowRepository", "text!templates/floweditor.html", "utils/uiutils", "utils/stringutils"], function(repository, template, uiUtils, stringUtils){
	var setFlow = function(flow){
		flow = flow || {};
		var self = this;
		self.flow = ko.viewmodel.fromModel(flow);
		ko.computed(function() {
			//set up dependency on selected region and also the original master list that might yet be loading async
			var region = ko.unwrap(self.flow.region);
			var countryList = ko.unwrap(self.mastercountryList);
			if (countryList) {
				var filtered = $.map(countryList, function(country, i) {
					return (country.region === region) ? country.name : null;
				});
				self.countryListFiltered(filtered);
			}
			else {
				return [];
			}
		});

		ko.computed(function() {
			//set up dependency on selected region, country and also the original master list that might yet be loading async
			var region = ko.unwrap(self.flow.region);
			var country = ko.unwrap(self.flow.country);
			var acList = ko.unwrap(self.masteracList);
			if (acList) {
				var filtered = $.map(acList, function(ac, i) {
					return (ac.region === region && (ac.country === country || ac.country === undefined)) ? ac.name : null;
				});
				self.assetClassListFiltered(filtered);
			}
			else {
				return [];
			}
		});
	};

	var vm = function(param) {
		var self = this;
		var params = ko.unwrap(param);
		var flowId = ko.unwrap(params.id);
		this.detailsMode = params.mode;	///parent observable
		flowId = Number(flowId, 10);
		if (isNaN(flowId)) {
			uiUtils.showError("The flow id supplied is not a valid number.");
			return;
		}
		this.flow = {};
		this.regionList = ko.observable();
		this.mastercountryList = ko.observable();
		this.masteracList = ko.observable();
		this.countryListFiltered = ko.observable([]);
		this.assetClassListFiltered = ko.observable([]);
		this.view = ko.observable("background");
		this.viewClass = ko.computed(function(){
			return (self.view() === "foreground" ? "editor-view translucent" : "editor-view");
		});

		repository.getFlowById(flowId).done(setFlow.bind(this));

		//get all master list for editor
		$.when(repository.getAllRegions(), repository.getAllCountriesWithRegion(), repository.getAllAssetClassWithRegionAndCountry())
		.done(function(regions, countriesWithRegion, assetClassList) {
			self.regionList(regions);
			self.mastercountryList(countriesWithRegion);
			self.masteracList(assetClassList);
		})
		.fail(function(ex) {
			uiUtils.showError(stringUtils.format("An error occured - {0}", ex));
			self.detailsMode(false);
		});

		this.toggleView = function() {
			var viewText = self.view() === "background" ? "foreground" : "background"
			self.view(viewText);
		};
		this.save = function() {
			//TODO
		};
		this.cancel = function() {
			self.detailsMode(false);
		};

		this.dispose = function(){
			//TODO
			console.log("Disposing flow editor");
		};
	};

	return {viewModel : vm, template: template};
});