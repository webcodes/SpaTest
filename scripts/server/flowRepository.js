define(function(require) {
	var stringUtils = require("utils/stringutils");
	var localDb = require('server/localDb');
	var id = 10;
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
		if (!id) {
			return deferred.resolve(getNewTemplate());
		}
		var key = "flow-" + id;
		//check localstorage before going to server.
		var flow = localDb.getItem(key);
		if (flow) {
			return deferred.resolve(flow);
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

	var incrementId = function() {
		return id++;
	};

	var addFlow = function(profileId, flow) {
		var deferred = new $.Deferred();
		var key = "profile-flows-" + profileId;
		try{
			flow.id = incrementId();
			var singleKey = "flow-" + flow.id;
			var flows = localDb.getItem(key);
			if (flows) {
				flows.push(flow);
				localDb.setItem(key, flows);
				localDb.setItem(singleKey, flow);
				return deferred.resolve(flow);
			}
		}
		catch(ex) {
			console.log(stringUtils.format("An error occured, {0}", ex) );
			return deferred.reject(ex);
		}
		return deferred.promise();	
	};

	var getAllRegions = function() {
		var deferred = new $.Deferred();
		deferred.resolve(["AMRS", "EMEA", "APAC"]);
		return deferred.promise();
	};

	var getAllCountriesWithRegion = function(region) {
		var deferred = new $.Deferred();
		deferred.resolve([{region: "AMRS", name: "USA"}, {region: "AMRS", name: "Canada"}, {region: "AMRS", name: "Brazil"}]);
		return deferred.promise();
	};

	var getAllAssetClassWithRegionAndCountry = function(region) {
		var deferred = new $.Deferred();
		// try {
		// 	throw new Error("No connection estalished.");	
		// }
		// catch(ex) {
		// 	deferred.reject(ex);
		// }
			
		deferred.resolve([
			{region: "AMRS", country: "USA", name: "Equities"}, 
			{region: "AMRS", country: "USA", name: "Options"}, 
			{region: "AMRS", country: "USA", name: "Futures"}, 
			{region: "AMRS", country: "Canada", name: "Equities"}, 
			{region: "AMRS", country: "Canada", name: "Options"},
			{region: "AMRS", country: "Brazil", name: "Equities"}, 
			{region: "AMRS", country: "Brazil", name: "Options"},
			{region: "EMEA", name: "Options"},
			{region: "EMEA", name: "Equities"},
			{region: "APAC", name: "Equities"}
		]);
		return deferred.promise();
	};
	return {
		getAllFlowsForProfile : getFlowsForProfile,
		getFlowById : getFlowById,
		getAllRegions : getAllRegions,
		getAllCountriesWithRegion : getAllCountriesWithRegion,
		getAllAssetClassWithRegionAndCountry : getAllAssetClassWithRegionAndCountry,
		addNewFlow: addFlow
	};
});