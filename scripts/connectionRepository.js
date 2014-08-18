define(function(require){
	var utils = require('utils');
	var getConnections = function() {
		var deferred = new $.Deferred();
		var connections = require(["text!../fixtures/connections.json"], function(connectionsfile){
			try{
				var conns = JSON.parse(connectionsfile);
				return deferred.resolve(conns);
			}
			catch(ex) {
				console.log(utils.format("An error occured - {0}", ex));
				return deferred.reject();
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
				console.log(utils.format("An error occured - {0}", ex));
				return deferred.reject();
			}
		});
		return deferred.promise();	
	};

	return {
		getConnections : getConnections,
		getConnectionById : getConnectionById
	};
});