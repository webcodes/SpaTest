define(function (require){
	var utils = require("utils");
	//private
	var wrapTemplateInContainer = function(templateName, template, ele) {
		var wrapperId = utils.format("{0}-container", templateName);
		var wrapper = utils.format("<section id='{0}'></section>", wrapperId);
		$(wrapper).appendTo($(ele)).html(template);
		return $(ele).find(utils.format("#{0}", wrapperId));
	};

	var applyBindingsToComponent = function(context, vmodel, component) {
		//experimental
		vmodel = vmodel || {};
		vmodel.parentContext = context;// && context.$context;
		ko.applyBindings(vmodel, component);
	};
	var renderError = function(component) {
		var errorMessage = utils.format("<span class='{0}'><i class='fa fa-warning'></i>{1}</span>", ["error", "The component module does not have a ViewModel"]);
		$(component).html(errorMessage);
	};

	ko.bindingHandlers.component = {
		init: function(ele, valueAccessor, allBindings, viewModel, bindingContext){
			valueAccessor();
			
			ko.computed(function(){
				var param = ko.unwrap(valueAccessor());
				var moduleName = param.template;
				var templateName = utils.format("../templates/{0}.html",param.template);
				var template = "text!" + templateName;
				
				if (moduleName) {
					require([template, moduleName], function(template, module) {
	                    console.log("done fetching module and template");
						var container = wrapTemplateInContainer(param.template, template, ele);
							//expect the module to provide a constructor fo vm
						if(module.ViewModel && typeof(module.ViewModel === 'function')) {
							var vm = new module.ViewModel(bindingContext.$rawData);
							//ko.applyBindings(vm, container[0]);
							applyBindingsToComponent(bindingContext, vm, container[0]);
						}	
						else {
							renderError(container[0]);
						}
	                });
				}
			});
			
		}
	};
});