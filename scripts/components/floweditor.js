define(["server/flowRepository", "text!templates/floweditor.html", "utils/uiutils", "utils/stringutils"], function(repository, template, uiUtils, stringUtils){
	var setFlow = function(flow){
		flow = flow || {};
		var self = this;
		self.flow = ko.viewmodel.fromModel(flow);
		self.compVm = {
			custid : self.flow.custid,
			umirid : self.flow.umirid,
			bovespaid : self.flow.bovespaid
		};
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
		
		this.profileId = ko.unwrap(params.profileId);
		this.detailsMode = params.mode;	///parent observable
		this.modId = params.modId;	//do not unwrap. Just get the observable that needs to be set when saved.

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
			console.log(self.flow);
			var flowModel = ko.viewmodel.toModel(self.flow);
			console.log(flowModel);
			repository.addNewFlow(self.profileId, flowModel)
			.done(function(savedFlow) {
				//set the parent observable which is being subscribed in the parent as well
				self.modId(savedFlow.id);
				self.detailsMode(false);
			})
			.fail(function(ex) {
				uiUtils.showError(stringUtils.format("An error occured - {0}", ex));
			});
		};

		this.cancel = function() {
			self.detailsMode(false);
		};

		this.postbox = (function() {
			var notifier = ko.observable();
			var publish = function(topic, newValue) {
				notifier.notifySubscribers(newValue, topic);
			};
			var subscribe = function(topic, callback, target) {
				target = target || this;
				notifier.subscribe(function(newValue) {
					callback.call(this, newValue);
				}, target, topic);
			};
			return {
				publish: publish,
				subscribe : subscribe
			};
		})();
		


		ko.computed(function() {
			var region = ko.unwrap(self.flow.region);
			var country = ko.unwrap(self.flow.country);
			var ac = ko.unwrap(self.flow.assetclass);
			self.postbox.publish("acrcchanged", {region: region, ac: ac, country : country});
		});

		this.dispose = function(){
			//TODO
			console.log("Disposing flow editor");
		};
	};

	return {viewModel : vm, template: template};
});