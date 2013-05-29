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
						if (doc.type == "user") {
							emit(doc._id, doc);
						}
					}
				},
				"allUsersFromOneDocument" : {
					map : function(doc) {
						if (doc._id == "user") {
							for (var i = 0; i < doc.users.length; i++) {
								emit(doc.users[i].id, doc.users[i]);
							}
						}
					}
				},
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
			"description" : 0
		}, function(err, resp) {
			callback();
		});
	}
	insertUsers = function(iter, app_id, callback) {
		var array = new Array();
		for (var id = 0; id < iter; id++) {
			array.push({
				"_id" : "app" + app_id + "-user" + id,
				"appID" : app_id,
				"type" : 'user',
				"name" : 0,
				"description" : 0
			});
		};
		var docs = {
			"docs" : array
		};
		engine.bulk(docs, function(err, resp) {
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
			key : "app" + app_id + "-user" + id
		}, function(err, doc) {
			callback();
		});
	}
	selectUsersFromOneDocument = function(app_id, id, callback) {
		engine.view('users', "allUsersFromOneDocument", {
			key : "app" + app_id + "-user" + id
		}, function(err, doc) {
			callback();
		});
	}
	insertUsersInOneDocument = function(iter, callback) {
		var array = new Array();
		for (var app_id = 0; app_id < 10; app_id++) {
			for (var id = 0; id < (iter / 10); id++) {
				array.push({
					"id" : "app" + app_id + "-user" + id,
					"appID" : app_id,
					"name": 0,
					"description": 0
				});
			};
		}
		engine.insert({
			"_id" : "user",
			"users" : array
		}, function(err, resp) {
			console.log(resp)
			callback();
		});
	}

	return {
		selectUsersFromOneDocument : selectUsersFromOneDocument,
		insertUsersInOneDocument : insertUsersInOneDocument,
		insertUsers : insertUsers,
		selectUsersByAppid : selectUsersByAppid,
		getName : getName,
		createBase : createBase,
		insertBadges : insertBadges,
		insertGameEngine : insertGameEngine,
		insertUser : insertUser,
		close : close
	}

});
