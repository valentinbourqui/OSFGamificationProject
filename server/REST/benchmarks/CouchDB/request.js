define(['../../variables/cradleVariables'], function(cradleVariables) {
	var engine;
	var nano = require('nano')("http://" + cradleVariables.host + ":" + cradleVariables.port), username = cradleVariables.user, userpass = cradleVariables.password, callback = console.log// this would normally be some callback

	createBase = function(callback) {

		nano.db.destroy('osf_benchmarks');
		nano.db.create('osf_benchmarks', function(err, body) {

		});
		engine = nano.use('osf_benchmarks');
		engine.insert({
			"views" : {
				"allUsersByAppID" : {
					map : function(doc) {
						if (doc.type = "user") {
							emit([doc.appID, doc._id], doc);
						}
					}
				}
			},
			"shows" : {
				"allByUserID" : function(doc, req) {
					return {
						body : JSON.stringify({
							user : doc
						})
					};
				}
			},
			"updates" : {
				"inplace" : function(doc, req) {
					var body = JSON.parse(req.body);
					doc.points = body.points;
					doc.badgesIDList = body.badgesIDList;
					doc.levelID = body.levelID;
					return [doc, JSON.stringify(doc)];
				}
			}
		}, '_design/users');
		callback();

	}
	insertBadges = function(id, app_id, callback) {
		engine.insert({
			"appID" : app_id,
			"type" : 'badge',
			"name" : 0,
			"description" : 0,
			"URLBadge" : 0,
			"points" : 0
		}, function(err, resp) {
			callback();
		});
	}
	insertGameEngine = function(id, callback) {
		engine.insert({
			"_id" : id,
			"type" : 'game_engine',
			"name" : 0,
			"description" : 0,
			"URLBadge" : 0,
			"points" : 0
		}, function(err, resp) {
			callback();
		});
	}
	insertUser = function(id, app_id, callback) {
		engine.insert({
			"_id" : "app" + app_id + "-user" + id,
			"appID" : app_id,
			"type" : 'user',
			"name" : 0,
			"description" : 0,
			"URLBadge" : 0,
			"points" : 0
		}, function(err, resp) {
			callback();
		});
	}
	close = function(callback) {
		callback();
	}
	getName = function() {
		return "CouchDB";
	}
	selectUsersByAppid = function(app_id, id, callback) {
		engine.view('users', "allUsersByAppID", {
			key : [app_id, "app" + app_id + "-user" + id]
		}, function(err, doc) {
			callback();
		});
	}

	return {
		selectUsersByAppid : selectUsersByAppid,
		getName : getName,
		createBase : createBase,
		insertBadges : insertBadges,
		insertGameEngine : insertGameEngine,
		insertUser : insertUser,
		close : close
	}

});
