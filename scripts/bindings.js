"use strict";
define(function (require){
 
 var utils = require("utils");
 //private
 // var applyBindingsOnTemplate = function(ele, pModel, component) {
 	// return function(data) {
 		// $(ele).html( data );
 		// var container = $(ele).find("#container");
 		// //expect the jsModule to provide a constructor fo vm
 		// var vm = new component.ViewModel(pModel);
 		// ko.applyBindings(vm, container[0]);
 	// };
 // };

	ko.bindingHandlers.component = {
		init: function(ele, valueAccessor){
			valueAccessor();
		  	
			ko.computed(function(){
				var param = ko.unwrap(valueAccessor());
				var moduleName = param.template;
				var templateName = utils.format("../templates/{0}.html",param.template);
				if (console)
					console.log("name : " + templateName);
				var template = "text!" + templateName;
				var parentModel = ko.mapping.toJS(param.model || {}); //copy into a new POJO
				
				if (moduleName) {
					 require([template, moduleName], function(template, module) {
                        if (console)
                        	console.log("done");
						$(ele).html(template);
						var container = $(ele).find("#container");
						//expect the module to provide a constructor fo vm
						var vm = new module.ViewModel(parentModel);
						ko.applyBindings(vm, container[0]);
                    });
				}
			});
			
		}
	};
});