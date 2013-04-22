define(['../../../tools/engine', '../../../tools/validatorContent', '../../../tools/sendResponse'], function(engine, validator, sendResponse) {

	// Create a new game engine
	createGameEngine = function(req, res) {
		var JSONContent = req.body;

		// Data Validation
		validator.check(req.is('json'), "Content-type must to be json").equals(true);
		validator.check(JSONContent.name, "Name is empty").notNull();
		validator.check(JSONContent.description, "Description is empty").notNull();
		//TODO : Check if the user doesn't give others incorrects attributes

		// Check if error are found and flush errors
		var errors = validator.getErrors();
		validator.flushErrors();

		//TODO : Generate the secure key
		//TODO : Check the security on game engine per user

		if (errors[0] == null) {
			engine.insert({
				"type" : "gameEngine",
				"name" : JSONContent.name,
				"description" : JSONContent.description,
				"APIKey" : "",
				"secureKey" : ""
			}, function(err, response) {
				if (err) {
					sendResponse.sendErrorsDBError(res, err);
				} else {
					engine.show('gameEngines', 'allByGameEngineID', response.id, function(err, doc) {
						if (err) {
							sendResponse.sendErrorsDBError(res, err);
						} else {
							sendResponse.sendObjectCreated(res, gameEngineResponse(doc.gameEngine));
						}
					});
				}
			});
		} else {
			sendResponse.sendErrorsBadContent(res, errors);
		}
	};

	// Select a game engine
	selectGameEngine = function(req, res) {
		engine.show('gameEngines', 'allByGameEngineID', req.params.appid, function(err, doc) {
			if (err) {
				sendResponse.sendErrorsDBError(res, err);
			} else {
				if (doc.gameEngine == null) {
					sendResponse.sendErrorsNotFound(res, "GameEngine not found");
					return;
				}
				sendResponse.sendObject(res, gameEngineResponse(doc.gameEngine));
			}
		});

	};

	// delete a game engine
	deleteGameEngine = function(req, res) {
		engine.show('gameEngines', 'allByGameEngineID', req.params.appid, function(err, body) {
			if (err) {
				sendResponse.sendErrorsDBError(res, err);
			} else if (body.gameEngine == null) {
				sendResponse.sendWariningDelete(res, "Object Not found");
			} else {
				engine.destroy(body.gameEngine._id, body.gameEngine._rev, function(err, responseTwo) {
					if (err) {
						sendResponse.sendErrorsDBError(res, err);
					} else {
						engine.view('gameEngines', "allObjcetsByAppID", {
							key : req.params.appid
						}, function(err, body) {
							if (err) {
								sendResponse.sendErrorsDBError(res, err);
							} else {
								for (var i in body.row) {
									engine.destroy(body.row[i]._id, body.row[i]._rev);
								}
								var JSONContent = JSON.stringify(body);
								sendResponse.sendObject(res, JSONContent);
							}
						});
						var JSONContent = JSON.stringify(responseTwo);
						sendResponse.sendObject(res, JSONContent);
					}
				});
			}
		});
	};

	// Update a game engine
	updateGameEngine = function(req, res) {
		var JSONContent = req.body;

		// Check the login

		// TODO

		//validate data
		validator.check(req.is('json'), "Content-type must to be json").equals(true);
		validator.check(JSONContent.name, "Name is empty").notNull();
		validator.check(JSONContent.description, "Description is empty").notNull();

		// Check if error are found and flush errors
		var errors = validator.getErrors();
		validator.flushErrors();

		if (errors[0] == null) {
			engine.atomic("gameEngines", "inplace", req.params.appid, JSONContent, function(err, doc) {
				if (err) {
					sendResponse.sendErrorsDBError(res, err);
				} else {
					sendResponse.sendObject(res, gameEngineResponse(doc));
				}
			});
		} else {
			sendResponse.sendErrorsBadContent(res, errors);
		}
	};

	//Utils
	checkExistGameEngine = function(req, res, func) {
		engine.show('gameEngines', 'allByGameEngineID', req.params.appid, function(err, response) {
			if (!err) {
				//TODO: Check the security
				JSONContentEngine = response.gameEngine;
				if (JSONContentEngine == null) {
					sendResponse.sendErrorsNotFound(res, "GameEngine not found");
					return;
				}
				func();
			} else {
				sendResponse.sendErrorsBadContent(res, "Error : Bad Content");
			}
		});
	};

	// Private
	gameEngineResponse = function(doc) {
		resObject = {
			"id" : doc._id,
			"name" : doc.name,
			"description" : doc.description,
			"APIKey" : doc.APIKey,
			"secureKey" : doc.secureKey
		};
		return JSON.stringify(resObject);
	}

	return {
		createGameEngine : createGameEngine,
		selectGameEngine : selectGameEngine,
		deleteGameEngine : deleteGameEngine,
		updateGameEngine : updateGameEngine,
		checkExistGameEngine : checkExistGameEngine
	}

});

