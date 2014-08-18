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
		genderList : ['Male', 'Female'],
		sex : ko.observable().publishOn("GENDERCHANGED"),
		age: ko.observable().publishOn("AGECHANGED")
	};
	viewModel.fullName = ko.computed(function() {
		return viewModel.firstName() + ' ' + viewModel.lastName();
	}).publishOn("FULLNAMECHANGED");

	ko.applyBindings(viewModel);
});