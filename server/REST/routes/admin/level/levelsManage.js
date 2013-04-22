define(['../../../tools/engine', '../../../tools/validatorContent', '../../../tools/sendResponse', '../gameEngine/gameEnginesManage'], function(engine, validator, sendResponse, gameEngine) {

	// Add a level for for a sepcified application
	// spécifier dans le HEADER de la requête : Content-Type : application/json
	createLevel = function(req, res) {
		// Check admin ID
		var JSONContentLevel = req.body;

		//validate data
		validator.check(JSONContentLevel.points, "Points is empty").notNull();
		validator.check(JSONContentLevel.points, "Points invalid integer").isInt();
		validator.check(JSONContentLevel.name, "Name is empty").notNull();
		validator.check(JSONContentLevel.description, "Description is empty").notNull();

		// Check if error are found and flush errors
		var errors = validator.getErrors();
		validator.flushErrors();

		if (errors[0] == null) {
			gameEngine.checkExistGameEngine(req, res, function() {
				engine.insert({
					"appID" : req.params.appid,
					"type" : 'level',
					"name" : JSONContentLevel.name,
					"description" : JSONContentLevel.description,
					"points" : JSONContentLevel.points
				}, function(err, resp) {
					if (err) {
						sendResponse.sendErrorsDBError(res, err);
					} else {
						engine.show('levels', 'allByLevelID', resp.id, function(err, doc) {
							sendResponse.sendObjectCreated(res, levelResponse(doc.level));
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
			engine.view('levels', "allByAppID", {
				key : req.params.appid
			}, function(err, body) {
				if (err) {
					sendResponse.sendErrorsDBError(res, err);
				} else {
					var JSONContent = JSON.stringify(body);
					sendResponse.sendObject(res, JSONContent);
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
				sendResponse.sendObject(res, levelResponse(doc.level));
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
		var JSONContent = req.body;

		//validate data
		validator.check(JSONContent.points, "Points is empty").notNull();
		validator.check(JSONContent.points, "Points invalid integer").isInt();
		validator.check(JSONContent.name, "Name is empty").notNull();
		validator.check(JSONContent.description, "Description is empty").notNull();

		// Check if error are found and flush errors
		var errors = validator.getErrors();
		validator.flushErrors();

		if (errors[0] == null) {
			gameEngine.checkExistGameEngine(req, res, function() {
				engine.atomic("levels", "inplace", req.params.id, JSONContent, function(err, doc) {
					if (err) {
						sendResponse.sendErrorsDBError(res, err);
					} else {
						sendResponse.sendObject(res, levelResponse(doc));
					}
				});
			});
		} else {
			sendResponse.sendErrorsBadContent(res, errors);
		}
	};

	// Private
	levelResponse = function(doc) {
		resObject = {
			"id" : doc._id,
			"name" : doc.name,
			"description" : doc.description,
			"points" : doc.points
		};
		return JSON.stringify(resObject);
	}

	return {
		createLevel : createLevel,
		selectLevel : selectLevel,
		updateLevel : updateLevel,
		deleteLevel : deleteLevel,
		selectAllLevels : selectAllLevels
	}

});

