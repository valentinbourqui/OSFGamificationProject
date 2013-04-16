define(['../../../tools/engine', '../../../tools/validatorContent', '../../../tools/sendResponse'], function(engine, validator, sendResponse) {

	// Add a level for for a sepcified application
	createLevel = function(req, res) {
		// Check admin ID
		engine.view('gameEngines', 'allByGameEngineID', {
			key : req.params.appid
		}, function(err, response) {
			if (!err) {
				req.on('data', function(chunk) {
					var JSONContent = JSON.parse(chunk);
					// Check the security

					// TODO

					//validate data
					validator.check(JSONContent.points, "Points is empty").notNull();
					validator.check(JSONContent.points, "Points invalid integer").isInt();
					validator.check(JSONContent.name, "Name is empty").notNull();
					validator.check(JSONContent.description, "Description is empty").notNull();

					// Check if error are found and flush errors
					var errors = validator.getErrors();
					validator.flushErrors();

					if (errors[0] == null) {
						engine.insert({
							"appID" : req.params.appid,
							"type" : 'level',
							"content" : [JSONContent]
						}, function(err, body) {
							if (err) {
								sendResponse.sendErrorsDBError(res, err);
							} else {
								var JSONContent = JSON.stringify({
									"response" : body
								});
								sendResponse.sendObjectCreated(res, JSONContent);
							}
						});
					} else {
						sendResponse.sendErrorsBadContent(res, errors);
					}
				});
			} else {
				sendResponse.sendErrorsBadContent(res, "Error : Bad appID");
			}
		});
	};

	// Select all levels for a sepcified application
	selectAllLevels = function(req, res) {
		// Check admin ID
		engine.view('gameEngines', 'allByGameEngineID', {
			key : req.params.appid
		}, function(err, response) {
			if (!err) {
				// Check the security

				// TODO

				// Check if error are found and flush errors
				var errors = validator.getErrors();
				validator.flushErrors();
				
				if (true){//errors[0] == null) {
					engine.view('levels', "allLevelsByAppID", {
						key : req.params.appid
					}, function(err, body) {
						if (err) {
							sendResponse.sendErrorsDBError(res, err);
						} else {
							var JSONContent = JSON.stringify(body);
							sendResponse.sendObject(res, JSONContent);
						}
					});
				} else {
					sendResponse.sendErrorsBadContent(res, errors);
				}
			} else {
				sendResponse.sendErrorsBadContent(res, "Error : Bad appID");
			}
		});
	};

	// Select a level for a sepcified application
	selectLevel = function(req, res) {
		// Check admin ID
		engine.view('gameEngines', 'allByGameEngineID', {
			key : req.params.appid
		}, function(err, response) {
			if (!err) {
				// Check the security

				// TODO

				// Check if error are found and flush errors
				var errors = validator.getErrors();
				validator.flushErrors();
				
				if (true){//errors[0] == null) {
					engine.show('levels', 'allByLevelID', req.params.id, function(err, doc) {
						if (err) {
							sendResponse.sendErrorsDBError(res, err);
						} else {

							var JSONContent = JSON.stringify(doc);
							sendResponse.sendObject(res, JSONContent);
						}
					});
				} else {
					sendResponse.sendErrorsBadContent(res, errors);
				}
			} else {
				sendResponse.sendErrorsBadContent(res, "Error : Bad appID "+err);
			}
		});
	};

	// delete a level for an
	deleteLevel = function(req, res) {
		// Check admin ID
		engine.view('gameEngines', 'allByGameEngineID', {
			key : req.params.appid
		}, function(err, response) {
			if (!err ) {
				// Check the security

				// TODO

				// Check if error are found and flush errors
				var errors = validator.getErrors();
				validator.flushErrors();
				if (true){//errors[0] == null) {
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
				} else {
					sendResponse.sendErrorsBadContent(res, errors);
				}
			} else {
				sendResponse.sendErrorsBadContent(res, "Error : Bad appID");
			}
		});
	};

	// update a level
	updateLevel = function(req, res) {
		// Check admin ID
		engine.view('gameEngines', 'allByGameEngineID', {
			key : req.params.appid
		}, function(err, response) {
			if (!err ) {
				req.on('data', function(chunk) {
					var JSONContent = JSON.parse(chunk);
					console.log();
					// Check the login

					// TODO

					//validate data
					validator.check(JSONContent.points, "Points is empty").notNull();
					validator.check(JSONContent.points, "Points invalid integer").isInt();
					validator.check(JSONContent.name, "Name is empty").notNull();
					validator.check(JSONContent.description, "Description is empty").notNull();

					// Check if error are found and flush errors
					var errors = validator.getErrors();
					validator.flushErrors();

					if (errors[0] == null) {
						engine.atomic("levels", "inplace", req.params.id, JSONContent, function(err, response) {
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
			} else {
				sendResponse.sendErrorsBadContent(res, "Error : Bad appID");
			}
		});
	};

	return {
		createLevel : createLevel,
		selectLevel : selectLevel,
		updateLevel : updateLevel,
		deleteLevel : deleteLevel,
		selectAllLevels : selectAllLevels
	}

});

