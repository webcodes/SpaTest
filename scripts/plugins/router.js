define(function() {
	
	//TODO: Create a sammy plugin to elegantly provide the callback.
	//May be provide a routeactivator object that can take a callback. 
	//And then the callback can use the context of the VM and still use the sammy context usign a route object?
	

	var Router = function (el) {
		
		var sammy = Sammy(el, function(){
			this.debug = true;
		});

		this.activate = function(path) {
			if (path) {
				sammy.run(path);
			}
			else {
				if (sammy.getLocation().indexOf("#") < 0) {
					sammy.run("#/");
				}
				else {
					sammy.run();
				}
			}
			return this;
		};

		this.mapRoutes = function(routes) {
			routes = routes || [];
			sammy.mapRoutes(routes);
			return this;
		};	

		this.bind = function(name,callback) {
			sammy.bind(name,callback);
		};
		/*this.isRunning = function() {
			return sammy.isRunning();
		};

		this.dispose = function() {
			//sammy.destory();
			sammy.unload();
		};*/
	};
	return Router;
});