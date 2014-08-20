define(function(require){
	//private 
	var replacer = function(actual, index){
		return function(match, offset, string) {
			var bracesRex = /[{,}]/g;
			//console.log(bracesRex.test(match));
			var matchedIndex = +match.replace(bracesRex, '');
			return (matchedIndex === index-1 ? actual : '');
		};
	};
	
	var format = function(str, arr) {
		//var rex = /\{([0-9]+)\}/g;
		var newStr = '', actuals;
		
		if (arr instanceof Array) {
			actuals = arr;
		}
		else {
			actuals = [];
			for(var i = 1; i< arguments.length; i++) {
				actuals.push(arguments[i]);
			}
		}
		return str.replace(/\{([0-9]+)\}/g, function(_, index) {return actuals[index];});

	};

	
	return {
		format : format,
		
	};
});