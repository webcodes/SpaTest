define(function(require){
	var stringUtils = require("utils/stringutils");
	var localDb = require('server/localDb');
	
	//private
	var firstOrDefault = function (profiles, profileId) {
		var matches = $.grep(profiles, function(value, index) {
			return value.id === profileId;
		});
		return (matches && matches.length > 0) ? matches[0] : null;
	}

	var findMatchingProfiles = function(profiles, searchParam) {
		if (!searchParam) {
			return profiles;
		}
		/// This is field:value search . Will do this later
		/* 
		else {
			
			var rex = /([^:,]*):("(?:\\.|[^"\\]+)*"|[^,"]*)/;
			var matches = rex.exec(searchParam);
			if (matches) {
				var criteria = $.map(matches, function(val, index) {
					return {key: val[1], value: val[2]};
				});
				if (criteria){
					var matchingProfiles = $.grep(profiles, function (profile, index) {
						var matched = false;
						$.each(criteria, function(criterion, i) {
							var key = criterion.key;
							var value = criterion.value;
							profile[key].indexOf(value) >= 0;
						});
					return (
						profile[].indexOf(searchParam) >= 0 ||
						profile.coper.indexOf(searchParam) >= 0 ||
						profile.legalName.indexOf(searchParam) >= 0 ||
						profile.segmentation.indexOf(searchParam) >= 0
					);
				});
				}
				else {
					return null;
				}
			}*/
		else {
			var matchingProfiles = $.grep(profiles, function (profile, index) {
				return (
					profile.ips.indexOf(searchParam) >= 0 ||
					profile.coper.indexOf(searchParam) >= 0 ||
					profile.legalName.indexOf(searchParam) >= 0 ||
					profile.segmentation.indexOf(searchParam) >= 0
				);
			});
			return matchingProfiles;
		}
	};
	var getProfiles = function(searchParam) {
		var deferred = new $.Deferred();
		require(["text!fixtures/profiles.json"], function(profilesFile) {
			try{
				var profiles = JSON.parse(profilesFile);
				var matchingProfiles = findMatchingProfiles(profiles, searchParam);
				localDb.setItem("searchedprofiles", matchingProfiles);
				return deferred.resolve(matchingProfiles);
			}
			catch(ex) {
				console.log(stringUtils.format("An error occured - {0}", ex));
				return deferred.reject(ex);
			}
		});
		return deferred.promise();	
	};

	var getRecentProfiles = function() {
		var deferred = new $.Deferred();
		var profiles = localDb.getItem("searchedprofiles");
		if (profiles) {
			deferred.resolve(profiles);
		}
		else {
			deferred.resolve(null);
		}
		return deferred.promise();	
	};

	var getProfileById = function(id){
		var deferred = new $.Deferred();
		var connections = require(["text!fixtures/connections.json"], function(connectionsfile){
			try{
				var conns = JSON.parse(connectionsfile);
				var matchingConn = $.grep(conns,function(conn, index){
					return conn.id === id;	
				});
				return deferred.resolve(matchingConn);
			}
			catch(ex) {
				console.log(stringUtils.format("An error occured - {0}", ex));
				return deferred.reject();
			}
		});
		return deferred.promise();	
	};

	var addProfile = function(profile) {
		var deferred = new $.Deferred();
		try{
			var profiles = localDb.getItem("searchedprofiles");
			if (profiles && Array.isArray(profiles)) {
				profiles.push(profile);
				localDb.setItem("profiles", profiles);
				return deferred.resolve(true);
			}
			return deferred.resolve(false);
		}
		catch(ex) {
			console.log(stringUtils.format("An error occured, {0}", ex) );
			return deferred.reject(ex);
		}
		return deferred.promise();	
	};

	var updateProfile = function(profile) {
		var deferred = new $.Deferred();
		try{
			//throw new Error("Internal error saving to localDB");
			var profiles = localDb.getItem("profiles");
			if (profiles && Array.isArray(profiles)) {
				var match = firstOrDefault(profiles, profile.id);
				{
					match.segmentation = profile.segmentation;
					match.ips = profile.ips;
					match.coper = profile.coper;
					match.legalName = profile.legalName;
				}
				localDb.setItem("profiles", profiles);
				return deferred.resolve(true);
			}
			return deferred.resolve(false);
		}
		catch(ex) {
			console.log(stringUtils.format("An error occured, {0}", ex) );
			return deferred.reject(ex);
		}
		return deferred.promise();	
	};

	return {
		getRecentProfiles : getRecentProfiles,
		searchProfiles : getProfiles,
		getProfileById : getProfileById,
		updateProfile : updateProfile,
		addProfile : addProfile
	};
});