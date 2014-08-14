define(function (require){
 
 //private
 var applyBindingsOnTemplate = function(ele, observables, pModel, component) {
 	return function(data) {
 		$(ele).html( data );
 		var container = $(ele).find('#container');
 		//expect the jsModule to provide a constructor fo vm
 		var vm = new component.ViewModel(pModel, observables);
 		ko.applyBindings(vm, container[0]);
 	};
 };

 ko.bindingHandlers.component = {
		init: function(ele, valueAccessor){
			var param = valueAccessor();
			var jsModule, observes, parentModel;
			var templatefile = 'templates/' + (param.template || '') + '.html';
		  	jsModule = require('details');
			observes = param.observes || {};
			parentModel = ko.mapping.toJS(param.model || {}); //copy into a new POJO
			$.get(templatefile, applyBindingsOnTemplate(ele, observes, parentModel, jsModule ));
			
		}
	};
});