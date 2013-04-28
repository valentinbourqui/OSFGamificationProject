define(['../../../tools/engine',
		'../../../tools/validatorContent', 
		'../../../tools/sendResponse', 
		'../../admin/gameEngine/gameEnginesManage',
		'../../admin/level/levelsManage'],
		function(
			engine, 
			validator, 
			sendResponse, 
			gameEngine,
			levelManage) {


	// Add a user for for a sepcified application
	createUser = function(req, res) {
		// Check admin ID
		gameEngine.checkExistGameEngine(req, res, function() {
			levelManage.checkFirstLevelExist(req, res, req.params.appid, function(idLevel) {
				engine.insert(userStorage(req.params.appid,idLevel), function(err, resp) {
					if (err) {
						sendResponse.sendErrorsDBError(res, err);
					} else {
						engine.show('users', 'allByUserID', resp.id, function(err, doc) {
							levelManage.selectLevelUtils(doc.user.levelID , function(level){
							if(level==null)
								sendResponse.sendObjectCreated(res, userStringResponse(doc.user));
							else
								sendResponse.sendObjectCreated(res, userStringResponse(doc.user,level));
							});
						});
					}
				});
			});
		});
	};

	// Select a user for a sepcified application
	selectUser = function(req, res) {
		
		// TODO ADD BADGES INFORMATIONS
		
		gameEngine.checkExistGameEngine(req, res, function() {
			engine.show('users', 'allByUserID', req.params.id, function(err, doc) {
				levelManage.selectLevelUtils(doc.user.levelID, function(level) {
					if (level == null)
						sendResponse.sendObjectCreated(res, userStringResponse(doc.user));
					else
						sendResponse.sendObjectCreated(res, userStringResponse(doc.user, level));
				});
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

	return {
		createUser : createUser,
		selectUser : selectUser,
		deleteUser : deleteUser
	}

});
