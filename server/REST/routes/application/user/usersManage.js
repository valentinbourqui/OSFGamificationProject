define(['../../../tools/engine', '../../../tools/validatorContent', '../../../tools/sendResponse', '../../admin/gameEngine/gameEnginesManage'], function(engine, validator, sendResponse, gameEngine) {

	// Add a user for for a sepcified application
	createUser = function(req, res) {
		// Check admin ID
		
		// TODO check si un level 0 existe et mettre l'id 
		
		gameEngine.checkExistGameEngine(req, res, function() {
			engine.insert(userStorage(req.params.appid), function(err, resp) {
				if (err) {
					sendResponse.sendErrorsDBError(res, err);
				} else {
					engine.show('users', 'allByUserID', resp.id, function(err, doc) {
						sendResponse.sendObjectCreated(res, userStringResponse(doc.user));
					});
				}
			});
		});
	};
	
	// Select a user for a sepcified application
	selectUser = function(req, res) {
		/*gameEngine.checkExistGameEngine(req, res, function() {
			engine.show('badges', 'allByBadgeID', req.params.id, function(err, doc) {
				if (doc.badge == null) {
					sendResponse.sendErrorsNotFound(res, "Badge not found");
					return;
				}
				sendResponse.sendObject(res, badgeStringResponse(doc.badge));
			});
		});*/
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
	userStorage = function(appid) {
		var user = {
			"appID" : appid,
			"points" : 0,
			"type" : "user",
			"levelID" : 0,
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
