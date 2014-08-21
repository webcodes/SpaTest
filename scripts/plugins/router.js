define(function() {
	
	var Router = function () {
		
		var sammy = Sammy("#applicationHost", function(){
			//this.use('koComponentLoader');
		});

		this.activate = function() {
			if (sammy.getLocation().indexOf("#") < 0) {
				sammy.run("#/");
			}
			else
				sammy.run();
		};

		this.mapRoutes = function(routes) {
			routes = routes || [];
			sammy.mapRoutes(routes);
			return this;
		};	
	};
	var router = new Router();
	return router;
});