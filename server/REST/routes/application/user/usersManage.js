define(['../../../tools/engine',
		'../../../tools/validatorContent', 
		'../../../tools/sendResponse', 
		'../../admin/gameEngine/gameEnginesManage',
		'../../admin/level/levelsManage',
		'../../admin/badge/badgesManage'],
		function(
			engine, 
			validator, 
			sendResponse, 
			gameEngine,
			levelManage,
			badgeManage) {


	// Add a user for for a sepcified application
	createUser = function(req, res) {
		// Check admin ID
		gameEngine.checkExistGameEngine(req, res, function() {
			levelManage.checkLevel(req, res, req.params.appid,0, function(idLevel) {
				engine.insert(userStorage(req.params.appid, idLevel), function(err, resp) {
					if (err) {
						sendResponse.sendErrorsDBError(res, err);
					} else {
						engine.show('users', 'allByUserID', resp.id, function(err, doc) {
							if (err || doc.user == null) {
								sendResponse.sendErrorsBadContent(res, "Error : Bad Content");
							} else {
								levelManage.selectLevelUtils(doc.user.levelID, function(level) {
									if (level == null)
										sendResponse.sendObjectCreated(res, userStringResponse(doc.user));
									else
										sendResponse.sendObjectCreated(res, userStringResponse(doc.user, level));
								});
							}
						});
					}
				});
			});
		});
	}; 



	// Select a user for a sepcified application
	selectUser = function(req, res) {


		gameEngine.checkExistGameEngine(req, res, function() {
			engine.show('users', 'allByUserID', req.params.id, function(err, doc) {
				if (err || doc.user == null) {
					sendResponse.sendErrorsBadContent(res, "Error : Bad Content");
				} else {
					badgeManage.selectbadgesUtils(doc.user.badgesIDList, function(badges) {
						levelManage.selectLevelUtils(doc.user.levelID, function(level) {
							if (level == null && badges == null)
								sendResponse.sendObject(res, userStringResponse(doc.user));
							else if(badges ==null)
								sendResponse.sendObject(res, userStringResponse(doc.user, level));
						    else if(level ==null)
								sendResponse.sendObject(res, userStringResponseBadges(doc.user, badges));
						    else
								sendResponse.sendObject(res, userStringResponse(doc.user, level,badges));
						});
					});
				}
			});
		});
	};

	// delete a user
	deleteUser = function(req, res) {
		// Check admin ID
		gameEngine.checkExistGameEngine(req, res, function() {
			engine.show('users', 'allByUserID', req.params.id, function(err, body) {
				if (err) {
					sendResponse.sendErrorsDBError(res, err);
				} else if (body.user == null) {
					sendResponse.sendWariningDelete(res, "Object Not found");
				} else {
					engine.destroy(body.user._id, body.user._rev, function(err, responseTwo) {
						if (err) {
							sendResponse.sendErrorsDBError(res, err);
						} else {
							var JSONContent = JSON.stringify(responseTwo);
							sendResponse.sendObject(res, JSONContent);
						}
					});
				}
			});
		});
	};

	


	// Utils
	allUsersByAppID = function(req, res, func) {
		engine.view('users', "allUsersByAppID", {
			key : [req.params.appid, "user"]
		}, function(err, doc) {
			if (err) {
				sendResponse.sendErrorsDBError(res, err);
			} else {
				doc.rows.sort(function(a, b) {
					//return a.attributes.OBJECTID - B.attributes.OBJECTID;
					if (a.value.points == b.value.points)
						return 0;
					if (a.value.points < b.value.points)
						return +1;
					if (a.value.points > b.value.points)
						return -1;
				});
				var users = usersStringResponse(doc);
				searchInformationsUser(users, users.length, function(usersFull) {
					func(usersFull);
				});
			}
		});
	};

	searchInformationsUser = function(users, number,func) {
		number-=1;
		if(number == -1){
			func(users);		
		}
		else{
			badgeManage.selectbadgesUtils(users[number].badgesIDList, function(badges) {
						levelManage.selectLevelUtils(users[number].levelID, function(level) {
							if (level == null && badges == null)
								users[number]=userStringResponseUtils(users[number]);
							else if(badges ==null)
								users[number]= userStringResponseUtils(users[number], level);
						    else if(level ==null)
								 users[number]= userStringResponseBadgesUtils(users[number], badges);
						    else
								users[number]= userStringResponseUtils(users[number], level,badges);
							searchInformationsUser(users,number,func);
						});
			});
			
		}

	}
	
	checkExistUser = function(req, res, func) {
		engine.show('users', 'allByUserID', req.params.userid, function(err, response) {
			if (!err) {
				JSONContentUser = response.user;
				if (JSONContentUser == null) {
					sendResponse.sendErrorsNotFound(res, "User not found");
					return;
				}
				func(JSONContentUser);
			} else {
				sendResponse.sendErrorsBadContent(res, "Error : Bad Content");
			}
		});
	};
	
	updateUserLevel = function(req, res,user) {
		// Check admin ID
		levelManage.checkLevel(req, res, req.params.appid,user.points, function(idLevel) {
				var oldIdLevel = user.levelID;
				user.levelID = idLevel;
				engine.atomic("users", "inplace",user._id, user , function(err, resp) {
					if (err) {
						sendResponse.sendErrorsDBError(res, err);
					} else {
						engine.show('users', 'allByUserID', resp._id,  function(err, doc) {
							if (err || doc.user == null) {
								sendResponse.sendErrorsBadContent(res, "Error : Bad Content");
							}
							else{
								levelManage.selectLevelUtils(doc.user.levelID , function(level){
									if(level==null || oldIdLevel==idLevel)
										sendResponse.sendObjectCreated(res, userStringResponse(doc.user));
									else
										sendResponse.sendObjectCreated(res, userStringResponse(doc.user,level));
								});
							}
						});
					}
				});
		});
	};

	updateUserBadge = function(req, res, user, badgeID, isNewBadge, jsonObj) {
		badgeManage.selectbadgeUtils(badgeID, function(badge) {
			if (isNewBadge && (badge.points == null || badge.points <= user.points)) {
				jsonObj.push({
					"badgeID" : badgeID,
				});
			}
			user.badgesIDList = jsonObj;
			engine.atomic("users", "inplace", user._id, user, function(err, resp) {
				if (err) {
					sendResponse.sendErrorsDBError(res, err);
				} else {
					engine.show('users', 'allByUserID', resp._id, function(err, doc) {
						if (err || doc.user == null) {
							sendResponse.sendErrorsBadContent(res, "Error : Bad Content");
						} else {
							if (isNewBadge && (badge.points == null || badge.points <= user.points)) 
								sendResponse.sendObjectCreated(res, userStringResponseBadge(doc.user, badge));
							else
						    	sendResponse.sendObjectCreated(res, userStringResponse(doc.user));	
						}
					});
				}
			});
		});
	}; 


	// Private
	userStringResponse = function(doc) {
		var user = {
			"id" : doc._id,
			"points" : doc.points
		};
		return JSON.stringify(user);
	}
	userStringResponse = function(doc,level) {
		var user = {
			"id" : doc._id,
			"points" : doc.points,
			"level": level
		};
		return JSON.stringify(user);
	}
	userStringResponse = function(doc,level,badges) {
		var user = {
			"id" : doc._id,
			"points" : doc.points,
			"level": level,
			"badges": badges
		};
		return JSON.stringify(user);
	}
	userStringResponseBadge = function(doc,badge) {
		var user = {
			"id" : doc._id,
			"points" : doc.points,
			"badge": badge
		};
		return JSON.stringify(user);
	}
	userStringResponseBadges = function(doc,badges) {
		var user = {
			"id" : doc._id,
			"points" : doc.points,
			"badges": badges
		};
		return JSON.stringify(user);
	}
	userStorage = function(appid,idLevel) {
		var user = {
			"appID" : appid,
			"points" : 0,
			"type" : "user",
			"levelID" : idLevel,
			"badgesIDList" : []
		}
		return user;
	}
	usersStringResponse = function(doc) {
		var jsonObj = []; //declare object
		doc.rows.forEach(function(doc) { 
			jsonObj.push({
				"id" : doc.value._id,
				"points" : doc.value.points,
			    "levelID" : doc.value.levelID,
				"badgesIDList" : doc.value.badgesIDList
			});
		});
	
		return jsonObj;
	}
		userStringResponseUtils = function(doc) {
		var user = {
			"id" : doc.id,
			"points" : doc.points
		};
		return user;
	}
	userStringResponseUtils = function(doc,level) {
		var user = {
			"id" : doc.id,
			"points" : doc.points,
			"level": level
		};
		return user;
	}
	userStringResponseUtils = function(doc,level,badges) {
		var user = {
			"id" : doc.id,
			"points" : doc.points,
			"level": level,
			"badges": badges
		};
		return user;
	}
	userStringResponseBadgesUtils = function(doc,badges) {
		var user = {
			"id" : doc.id,
			"points" : doc.points,
			"badges": badges
		};
		return user;
	}

	return {
		createUser : createUser,
		selectUser : selectUser,
		deleteUser : deleteUser,
		checkExistUser: checkExistUser,
		updateUserLevel: updateUserLevel,
		updateUserBadge: updateUserBadge,
		allUsersByAppID: allUsersByAppID,
		searchInformationsUser : searchInformationsUser
	}

});
