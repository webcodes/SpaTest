define(function(){
	var localStorage = window.localStorage;

	var get = function(key) {
		if (localStorage) {
			var val = localStorage[key];
			return val ? JSON.parse(val) : null;
		}
	};

	var set = function(key, value) {
		localStorage[key] = JSON.stringify(value);
	}
	
	return {
		getItem : get,
		setItem : set
	};
});