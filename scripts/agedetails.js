define(function(){
	var vm = function(pModel){
		this.parentModel = pModel;
		this.ageChild = ko.observable().subscribeTo("AGECHANGED");
		this.age = ko.computed(function(){
			return this.parentModel.parentModel.age ? ko.unwrap(this.parentModel.parentModel.age) : "age property is not available on parentModel";
		}, this);
	};

	return { ViewModel :vm };
});