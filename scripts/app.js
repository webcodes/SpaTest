requirejs.config({
	paths: {
		"text" : "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min"
	}
});
define(function(require) {
	var bindings = require('bindings');
	var viewModel = {
		firstName : ko.observable(''),
		lastName : ko.observable(''),
		gender : ko.observable()
	};
	viewModel.fullName = ko.computed(function() {
		return viewModel.firstName() + ' ' + viewModel.lastName();
	}).publishOn("FULLNAMECHANGED");

	ko.applyBindings(viewModel);
});