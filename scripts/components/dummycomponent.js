define(["text!templates/dummycomponent.html"], function(template) {
	var vm = function(param) {
		var self = this;
		//this.flow = ko.unwrap(param.flow);

		this.dependent = ko.observable("The cust id is empty");

		var postbox = param.postbox;
		postbox.subscribe("custidchanged", function(newVal) {
			this.dependent("The custid now is " + newVal);
		}, this);
		/*this.flow.custid.subscribe(function(val) {
			self.dependent("The custid now is " + val);
		}, null, "change");

		this.anotherDependent = ko.computed(function(){
			var cust = ko.unwrap(self.flow.custid);
			return "The custid here is " + cust;
		});*/
	};
	return {viewModel : vm, template : template};
});