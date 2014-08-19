define(function(require){
	var utils = require('utils');
	var localDb = require('localDb');
	var getProfiles = function(searchParam) {
		var deferred = new $.Deferred();
		var profiles = localDb.getItem("profiles");
		if (profiles) {
			deferred.resolve(profiles);
		}
		else {
			require(["text!../fixtures/profiles.json"], function(profilesFile) {
				try{
					var profiles = JSON.parse(profilesFile);
					localDb.setItem("profiles", profiles);
					return deferred.resolve(profiles);
				}
				catch(ex) {
					console.log(utils.format("An error occured - {0}", ex));
					return deferred.reject();
				}
			});
		}
		return deferred.promise();	
	};

	var getProfileById = function(id){
		var deferred = new $.Deferred();
		var connections = require(["text!../fixtures/connections.json"], function(connectionsfile){
			try{
				var conns = JSON.parse(connectionsfile);
				var matchingConn = $.grep(conns,function(conn, index){
					return conn.id === id;	
				});
				return deferred.resolve(matchingConn);
			}
			catch(ex) {
				console.log(utils.format("An error occured - {0}", ex));
				return deferred.reject();
			}
		});
		return deferred.promise();	
	};

	return {
		getProfiles : getProfiles,
		getProfileById : getProfileById
	};
});