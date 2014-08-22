define(function(require){
	var stringUtils = require("utils/stringutils");
	var localDb = require('server/localDb');
	var id = 0;
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

	var pushProfileToLocalDb = function(dbkey, profile, uniquekey) {
		var value = localDb.getItem(dbkey);
		//if an array, add it if unique key. If not update it.
		if (value && Array.isArray(value)) {
			var match = $.grep(value, function(val, i) {
				return val[uniquekey] === profile[uniquekey];
			});
			if (!match) {
				value.push(profile);
			}
			else {
				// $.each(value, function(val, i) {
				// return val[uniquekey] === profile[uniquekey];
				// });
				//TODO: Find a way to update the record.
				match = profile;
			}
		}
		else {
			value = [profile];
		}
		//else just update the value in place
		localDb.setItem(dbkey, value);
	};

	var incrementId = function() {
		if (id) {
			return id++;
		}
		var allprofiles = localDb.getItem("profiles");
		var ids = $.map(allprofiles, function(value, index){
			return Number(value.id);
		}); 
		var maxId = Math.max.apply(Math, ids);
		id = maxId+1;
		return id;
	};

	var getProfiles = function(searchParam) {
		var deferred = new $.Deferred();
		require(["text!fixtures/profiles.json"], function(profilesFile) {
			try{
				var profiles = JSON.parse(profilesFile);
				var matchingProfiles = findMatchingProfiles(profiles, searchParam);
				localDb.setItem("profiles", matchingProfiles);
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
		var profiles = localDb.getItem("visitedprofiles");
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
		//check localstorage before going to server.
		var profiles = localDb.getItem("profiles");
		if (profiles) {
			var match = firstOrDefault(profiles, id);
			if (match) {
				pushProfileToLocalDb("visitedprofiles", match, "id");
				return deferred.resolve(match);
			}
		}
		require(["text!fixtures/profiles.json"], function(profilesFile){
			try{
				var profiles = JSON.parse(profilesFile);
				var match = firstOrDefault(profiles, id);
				pushProfileToLocalDb("visitedprofiles", match, "id");
				return deferred.resolve(match);
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
			profile.id = incrementId();
			pushProfileToLocalDb("profiles", profile, "id");
			return deferred.resolve(profile);
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
			// if (profiles && Array.isArray(profiles)) {
			// 	var match = firstOrDefault(profiles, profile.id);
			// 	{
			// 		match.segmentation = profile.segmentation;
			// 		match.ips = profile.ips;
			// 		match.coper = profile.coper;
			// 		match.legalName = profile.legalName;
			// 	}
			// 	localDb.setItem("profiles", profiles);
			// 	return deferred.resolve(true);
			// }
			// return deferred.resolve(false);
			pushProfileToLocalDb("profiles", profile, "id");
			return deferred.resolve(profile);
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