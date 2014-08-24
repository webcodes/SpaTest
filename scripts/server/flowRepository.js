define(function(require) {
	var stringUtils = require("utils/stringutils");

	var getFlowsForProfile = function(profileId) {
		var deferred = new $.Deferred();
		require(["text!fixtures/flows.json"], function(flowsfile){
			try{
				var flows = JSON.parse(flowsfile);
				var matchingFlows = $.grep(flows, function(flow, i) {
					return flow.profileId === profileId;
				});
				return deferred.resolve(matchingFlows);
			}
			catch(ex) {
				console.log(stringUtils.format("An error occured - {0}", ex));
				return deferred.reject(ex);
			}
		});
		return deferred.promise();	
	};

	return {
		getAllFlowsForProfile : getFlowsForProfile
	};
});