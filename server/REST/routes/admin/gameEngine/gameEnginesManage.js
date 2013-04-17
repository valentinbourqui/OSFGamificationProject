define(['../../../tools/engine', '../../../tools/validatorContent', '../../../tools/sendResponse'], function(engine, validator, sendResponse) {

	// Create a new game engine
	createGameEngine = function(req, res) {
		req.on('data', function(chunk) {
			var JSONContent = JSON.parse(chunk);

			//validate data
			validator.check(JSONContent.name, "Name is empty").notNull();
			validator.check(JSONContent.description, "Description is empty").notNull();

			// Check if error are found and flush errors
			var errors = validator.getErrors();
			validator.flushErrors();

			//Generate the secure key
			// Check the security on game engine per user

			// TODO

			if (errors[0] == null) {
				engine.insert({
					"type" : 'gameEngine',
					"name" : JSONContent.name,
					"description": JSONContent.description, 
				}, function(err, response) {
					if (err) {
						sendResponse.sendErrorsDBError(res, err);
					} else {
						// return all information

						// TODO

						var JSONContent = JSON.stringify({
							"response" : response
						});
						sendResponse.sendObjectCreated(res, JSONContent);
					}
				});
			} else {
				sendResponse.sendErrorsBadContent(res, errors);
			}
		});
	};

	// Select a game engine
	selectGameEngine = function(req, res) {

		engine.show('gamEngine', 'allByGameEngineID', req.params.appid, function(err, doc) {
			if (err) {
				sendResponse.sendErrorsDBError(res, err);
			} else {

				var JSONContent = JSON.stringify(doc);
				sendResponse.sendObject(res, JSONContent);
			}
		});

	};

	// delete a game engine
	deleteGameEngine = function(req, res) {
		engine.show('gamEngine', 'allByGameEngineID', req.params.appid, function(err, body) {
			if (err) {
				sendResponse.sendErrorsDBError(res, err);
			} else if (body.gameEngine == null) {
				sendResponse.sendWariningDelete(res, "Object Not found");
			} else {
				engine.destroy(body.gameEngine._id, body.gameEngine._rev, function(err, responseTwo) {
					if (err) {
						sendResponse.sendErrorsDBError(res, err);
					} else {
						engine.view('gamEngine', "allObjcetsByAppID", {
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
		req.on('data', function(chunk) {
			var JSONContent = JSON.parse(chunk);
			console.log();
			// Check the login

			// TODO

			//validate data
			validator.check(JSONContent.name, "Name is empty").notNull();
			validator.check(JSONContent.description, "Description is empty").notNull();

			// Check if error are found and flush errors
			var errors = validator.getErrors();
			validator.flushErrors();

			if (errors[0] == null) {
				engine.atomic("gamEngine", "inplace", req.params.appid, JSONContent, function(err, response) {
					if (err) {
						sendResponse.sendErrorsDBError(res, err);
					} else {
						var JSONContent = JSON.stringify({
							"response" : response
						});
						sendResponse.sendObject(res, JSONContent);
					}
				});
			} else {

				sendResponse.sendErrorsBadContent(res, errors);
			}
		});
	};

	return {
		createGameEngine : createGameEngine,
		selectGameEngine : selectGameEngine,
		deleteGameEngine : deleteGameEngine,
		updateGameEngine : updateGameEngine
	}

});

