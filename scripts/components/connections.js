define(["server/connectionRepository","text!templates/connections.html", "utils/uiutils"], function(repository, template, uiUtils){
	
	var createViewModel = function(connections){
		connections = connections || [];
		var self = this;
		$.each(connections, function(index, conn) {
			self.connections.push({
				"id" : conn.id, 
				"obo" : conn.obo,
				"sendercomp" : conn.session.sendercomp,
				"network" : conn.session.network.name,
				"platform" : conn.session.platform.name,
				"editConnection" : editConnection
			});
		});
	};

	var vm = function(param) {
		var params = ko.unwrap(param);
		var profileId = ko.unwrap(params.profileId);
		profileId = Number(profileId, 10);
		if (isNaN(profileId)) {
			uiUtils.showError("The profile id supplied is not a valid number.");
			return;
		}
		this.connections = ko.observableArray([]);
		repository.getAllConnectionsForProfile(profileId).done(createViewModel.bind(this));

		this.dispose = function() {
			console.log("Disposing connection View Model");
			//TODO: dispose any computed, manual subscription, widget bindings here...
		};
	};

	var editConnection = function() {
		console.log(this);
	};

	return {
		viewModel : vm, 
		template : template
	};
});