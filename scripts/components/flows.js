define(["server/flowRepository", "text!templates/flows.html", "utils/uiutils"], function(repository, template, uiUtils){
	
	var createViewModel = function(flows){
		flows = flows || [];
		var self = this;
		var flatFlows = $.map(flows, function(flow, i) {
			return {
				"id" : flow.id, 
				"sendercomp" : flow.session.sendercomp,
				"platform" : flow.session.platform.name,
				"assetclass" : flow.assetclass,
				"channel" : flow.channel,
				"custid" : flow.custid,
				"region" : flow.region,
				"country" : flow.country,
				"status" : flow.status,
				"statusClass" : flow.status.toLowerCase()
			};
		});
		//var obFlows = ko.viewmodel.fromModel(flatFlows);
		self.flows(flatFlows);
	};

	var vm = function(param) {
		var self = this;
		var params = ko.unwrap(param);
		var profileId = ko.unwrap(params.profileId);
		profileId = Number(profileId, 10);
		if (isNaN(profileId)) {
			uiUtils.showError("The profile id supplied is not a valid number.");
			return;
		}
		this.detailsMode = ko.observable(false);
		this.flows = ko.observableArray([]);
		repository.getAllFlowsForProfile(profileId).done(createViewModel.bind(this));

		this.editFlow = function() {
			self.editId = this.id;
			self.detailsMode(true);
			console.log(this);
		};

		this.addFlow = function() {
			this.editId = 0;
			this.detailsMode(true);
			console.log(this);
		};

		this.dispose = function() {
			console.log("Disposing flows View Model");
			//TODO: dispose any computed, manual subscription, widget bindings here...
		};
	};

return {viewModel : vm, template : template};
});