define(["server/flowRepository", "text!templates/floweditor.html"], function(repository, template){
	var setFlow = function(flow){
		flow = flow || {};
		var self = this;
		self.flow(ko.viewmodel.fromModel(flow));
	};

	var vm = function(param) {
		var self = this;
		var params = ko.unwrap(param);
		var flowId = ko.unwrap(params.id);
		flowId = Number(flowId, 10);
		if (isNaN(flowId)) {
			uiUtils.showError("The flow id supplied is not a valid number.");
			return;
		}
		this.flow = ko.observable();
		this.view = ko.observable("background");
		this.viewClass = ko.computed(function(){
			return (self.view() === "foreground" ? "editor-view translucent" : "editor-view");
		});

		repository.getFlowById(flowId).done(setFlow.bind(this));

		this.toggleView = function() {
			var viewText = self.view() === "background" ? "foreground" : "background"
			self.view(viewText);
		};
		this.save = function() {
			//TODO
		};

		this.dispose = function(){
			//TODO
		};
	};

	return {viewModel : vm, template: template};
});