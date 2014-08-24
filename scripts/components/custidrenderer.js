define(["text!templates/custidrenderer.html"], function(template) {
	var vm = function(params) {
		var self = this;
		var param = ko.unwrap(params);
		this.flow = ko.unwrap(params.flow);
		this.needsUmir = ko.observable();
		this.needsBovespa = ko.observable();
		this.needsCust = ko.observable(true);
		//subscribe to changes in region, country and assetclass
		ko.computed(function() {
			var region = ko.unwrap(params.flow.region);
			var country = ko.unwrap(params.flow.country);
			var ac = ko.unwrap(params.flow.assetclass);
			self.needsBovespa(false);
			self.needsUmir(false);
			self.needsCust(true);
			if (region === "AMRS" && country === "Brazil") {
				self.needsBovespa(true);
			}
			else if (region === "AMRS" && country === "Canada"){
				self.needsUmir(true);
			}
			else if (region !== "AMRS") {
				self.needsCust(false);
			}
		});

		this.dispose = function() {
			console.log("Disposing the custidrenderer vm");
		};

	};
	return {viewModel : vm, template: template};
});