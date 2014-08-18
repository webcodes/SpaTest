define(function(){
	var vm = function(pModel){
		this.parentModel = pModel;	//POJO
		this.age = ko.observable();
		this.fullNameChild = ko.observable().subscribeTo("FULLNAMECHANGED");
		this.genderChild = ko.observable().subscribeTo("GENDERCHANGED");
		this.gender = ko.computed(function(){
			return ko.unwrap(this.parentModel.gender) || "gender property is not available on parentModel";
		}, this);
	};
	return {
		ViewModel : vm
	};
});