define(['../../../tools/engine', '../../../tools/validatorContent', '../../../tools/sendResponse', '../gameEngine/gameEnginesManage'], function(engine, validator, sendResponse, gameEngine) {

	// Add a level for for a sepcified application
	// spécifier dans le HEADER de la requête : Content-Type : application/json
	createLevel = function(req, res) {
		// Check admin ID
		var JSONContentLevel = req.body;

		//validate data
		validator.check(req.is('json'), validator.CONTENT_TYPE_NOT_JSON).equals(true);
		validator.check(JSONContentLevel.points, validator.POINTS_EMPTY).notNull();
		validator.check(JSONContentLevel.points, validator.POINTS_NOT_INTEGER).isInt();
		validator.check(JSONContentLevel.name, validator.NAME_EMPTY).notNull();
		validator.check(JSONContentLevel.description, validator.DESCRIPTION_EMPTY).notNull();

		// Check if error are found and flush errors
		var errors = validator.getErrors();
		validator.flushErrors();

		if (errors[0] == null) {
			gameEngine.checkExistGameEngine(req, res, function() {
				engine.insert(levelStorage(JSONContentLevel, req.params.appid), function(err, resp) {
					if (err) {
						sendResponse.sendErrorsDBError(res, err);
					} else {
						engine.show('levels', 'allByLevelID', resp.id, function(err, doc) {
							sendResponse.sendObjectCreated(res, levelStringResponse(doc.level));
						});
					}

				});
			});
		} else {
			sendResponse.sendErrorsBadContent(res, errors);
		}
	};

	// Select all levels for a sepcified application
	selectAllLevels = function(req, res) {
		gameEngine.checkExistGameEngine(req, res, function() {
			engine.view('levels', "allLevelsByAppID", {
				key : [req.params.appid, "level"]
			}, function(err, doc) {
				if (err) {
					sendResponse.sendErrorsDBError(res, err);
				} else {
					sendResponse.sendObject(res, levelsStringResponse(doc));
				}
			});
		});
	};

	// Select a level for a sepcified application
	selectLevel = function(req, res) {
		gameEngine.checkExistGameEngine(req, res, function() {
			engine.show('levels', 'allByLevelID', req.params.id, function(err, doc) {
				if (doc.level == null) {
					sendResponse.sendErrorsNotFound(res, "Level not found");
					return;
				}
				sendResponse.sendObject(res, levelStringResponse(doc.level));
			});
		});
	};

	// delete a level for an
	deleteLevel = function(req, res) {
		// Check admin ID
		gameEngine.checkExistGameEngine(req, res, function() {
			engine.show('levels', 'allByLevelID', req.params.id, function(err, body) {
				if (err) {
					sendResponse.sendErrorsDBError(res, err);
				} else if (body.level == null) {
					sendResponse.sendWariningDelete(res, "Object Not found");
				} else {
					engine.destroy(body.level._id, body.level._rev, function(err, responseTwo) {
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

	// update a level
	updateLevel = function(req, res) {
		// Check admin ID
		var JSONContentLevel = req.body;

		//validate data
		validator.check(req.is('json'), validator.CONTENT_TYPE_NOT_JSON).equals(true);
		validator.check(JSONContentLevel.points, validator.POINTS_EMPTY).notNull();
		validator.check(JSONContentLevel.points, validator.POINTS_NOT_INTEGER).isInt();
		validator.check(JSONContentLevel.name, validator.NAME_EMPTY).notNull();
		validator.check(JSONContentLevel.description, validator.DESCRIPTION_EMPTY).notNull();

		// Check if error are found and flush errors
		var errors = validator.getErrors();
		validator.flushErrors();

		if (errors[0] == null) {
			gameEngine.checkExistGameEngine(req, res, function() {
				engine.atomic("levels", "inplace", req.params.id, JSONContentLevel, function(err, doc) {
					if (err) {
						sendResponse.sendErrorsDBError(res, err);
					} else {
						sendResponse.sendObject(res, levelStringResponse(doc));
					}
				});
			});
		} else {
			sendResponse.sendErrorsBadContent(res, errors);
		}
	};

	// Private
	levelStringResponse = function(doc) {
		var level = {
			"id" : doc._id,
			"name" : doc.name,
			"description" : doc.description,
			"points" : doc.points
		};
		return JSON.stringify(level);
	}
	levelsStringResponse = function(doc) {
		var jsonObj = []; //declare object
		doc.rows.forEach(function(doc) { 
			jsonObj.push({
				"id" : doc.value._id,
				"name" : doc.value.name,
				"description" : doc.value.description,
				"points" : doc.value.points
			});
		});
		var levels = {
			"levels" : jsonObj
		};
		return JSON.stringify(levels);
	}
	levelStorage = function(body, appid) {
		var level = {
			"appID" : appid,
			"type" : 'level',
			"name" : body.name,
			"description" : body.description,
			"points" : body.points
		}
		return level;
	}

	return {
		createLevel : createLevel,
		selectLevel : selectLevel,
		updateLevel : updateLevel,
		deleteLevel : deleteLevel,
		selectAllLevels : selectAllLevels
	}

});

