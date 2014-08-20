define(['connectionRepository'], function(repository){
	
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

	var vm = function(pModel) {
		this.parentModel = pModel;
		this.connections = ko.observableArray([]);
		repository.getConnections().done(createViewModel.bind(this));
	};

	var editConnection = function() {
		console.log(this);
	};
	return {
		ViewModel : vm
	};
});