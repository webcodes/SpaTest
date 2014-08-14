define(function(){
	//private
	// var findPropertyByName = function(observables, propName){
	// 	ko.unwrap(observables);
	// 	var matches = $.grep(observables, function(observable, index){
	// 		return observable.name === propName;
	// 	});
	// 	if (matches && matches.length > 0) {
	// 		return matches[0];
	// 	}
	// 	else return null;
	// };
	var vm = function(pModel, observables){
		this.parentModel = pModel;	//POJO
		this.age = ko.observable();
		this.fullName = ko.observable().subscribeTo("FULLNAMECHANGED");
		// var fullName = findPropertyByName(observables,'fullName');
		// this.fullNameComp = ko.computed(function(){
		// 	return fullName.value();
		// });
	};
	return {
		ViewModel : vm
	};
});