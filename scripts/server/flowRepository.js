define(function(require) {
	var stringUtils = require("utils/stringutils");
	var localDb = require('server/localDb');
	
	var firstOrDefault = function (flows, flowId) {
		var matches = $.grep(flows, function(value, index) {
			return value.id === flowId;
		});
		return (matches && matches.length > 0) ? matches[0] : null;
	};

	var getFlowsForProfile = function(profileId) {
		var deferred = new $.Deferred();
		var key = "profile-flows-" + profileId;
		var fromCache = localDb.getItem(key);
		if (fromCache) {
			return deferred.resolve(fromCache);
		}
		require(["text!fixtures/flows.json"], function(flowsfile){
			try{
				var flows = JSON.parse(flowsfile);
				var matchingFlows = $.grep(flows, function(flow, i) {
					return flow.profileId === profileId;
				});
				localDb.setItem(key, matchingFlows);
				return deferred.resolve(matchingFlows);
			}
			catch(ex) {
				console.log(stringUtils.format("An error occured - {0}", ex));
				return deferred.reject(ex);
			}
		});
		return deferred.promise();	
	};

	var getFlowById = function(id){
		var deferred = new $.Deferred();
		if (!id)
			return deferred.resolve(getNewTemplate());
		var key = "flow-" + id;
		//check localstorage before going to server.
		var flow = localDb.getItem(key);
		if (flow) {
			return deferred.resolve(match);
		}
		require(["text!fixtures/flows.json"], function(flowsFile){
			try{
				var flows = JSON.parse(flowsFile);
				var match = firstOrDefault(flows, id);
				localDb.setItem(key, match);
				return deferred.resolve(match);
			}
			catch(ex) {
				console.log(stringUtils.format("An error occured - {0}", ex));
				return deferred.reject();
			}
		});
		return deferred.promise();	
	};

	var getNewTemplate = function() {
		return {
			"id" : 0,
			"assetclass" : "",
			"channel" : "",
			"country" : "",
			"region" : "",
			"custid" : "",
			"status" : "",
			"session" : {
				"id" : 0,
				"sendercomp" : "",
				"platform" : {
					"id" : 0,
					"name" : ""
				}
			}
		}
	};

	return {
		getAllFlowsForProfile : getFlowsForProfile,
		getFlowById : getFlowById
	};
});