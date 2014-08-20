define(function(require){
	var stringUtils = require("utils/stringutils");
	var findMatchingConnections = function(connections, searchParam) {
		if (!searchParam) {
			return connections;
		}
		else {
			var matchingConns = $.grep(connections, function (conn, index) {
				return (
					conn.obo.indexOf(searchParam) >= 0 ||
					conn.session.sendercomp.indexOf(searchParam) >= 0 ||
					conn.session.platform.name.indexOf(searchParam) >= 0 ||
					conn.session.platform.vendor.name.indexOf(searchParam) >= 0 ||
					conn.session.network.name.indexOf(searchParam) >= 0
				);
			});
			return matchingConns;
		}
	};

	var searchConnections = function(searchParam) {
		var deferred = new $.Deferred();
		var connections = require(["text!fixtures/connections.json"], function(connectionsfile){
			try{
				var conns = JSON.parse(connectionsfile);
				var matchingConns = findMatchingConnections(conns, searchParam);
				return deferred.resolve(matchingConns);
			}
			catch(ex) {
				console.log(stringUtils.format("An error occured - {0}", ex));
				return deferred.reject(ex);
			}
		});
		return deferred.promise();	
	};

	var getConnectionById = function(id){
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
				console.log(stringUtils.format("An error occured - {0}", ex));
				return deferred.reject();
			}
		});
		return deferred.promise();	
	};

	return {
		searchConnections : searchConnections,
		getConnectionById : getConnectionById
	};
});