define(['../../../tools/engine', '../../../tools/validatorContent', '../../../tools/sendResponse', '../gameEngine/gameEnginesManage'], function(engine, validator, sendResponse, gameEngine) {

	// Add a badge for for a sepcified application
	// spécifier dans le HEADER de la requête : Content-Type : application/json
	createBadge = function(req, res) {
		// Check admin ID
		var JSONContentBadge = req.body;

		//validate data
		validator.check(req.is('json'), validator.CONTENT_TYPE_NOT_JSON).equals(true);
		if (JSONContentBadge.points)
		validator.check(JSONContentBadge.points, validator.POINTS_NOT_INTEGER).isInt();
		validator.check(JSONContentBadge.name, validator.NAME_EMPTY).notNull();
		validator.check(JSONContentBadge.description, validator.DESCRIPTION_EMPTY).notNull();
		validator.check(JSONContentBadge.URLBadge, validator.URL_BADGE_EMPTY).notNull();
		validator.check(JSONContentBadge.URLBadge, validator.URL_BADGE_NOT_CORRECT).isUrl();
		validator.check(JSONContentBadge.URLBadge).checkIfImage();
  
    
		// Check if error are found and flush errors
		var errors = validator.getErrors();
		validator.flushErrors();

		if (errors[0] == null) {
			gameEngine.checkExistGameEngine(req, res, function() {
				engine.insert(badgeStorage(JSONContentBadge, req.params.appid), function(err, resp) {
					if (err) {
						sendResponse.sendErrorsDBError(res, err);
					} else {
						engine.show('badges', 'allByBadgeID', resp.id, function(err, doc) {
							sendResponse.sendObjectCreated(res, badgeStringResponse(doc.badge));
						});
					}
				});
			});
		} else {
			sendResponse.sendErrorsBadContent(res, errors);
		}
	};

	// Select all badges for a sepcified application
	selectAllBadges = function(req, res) {
		gameEngine.checkExistGameEngine(req, res, function() {
			engine.view('badges', "allBadgesByAppID", {
				key : [req.params.appid,"badge"]
			}, function(err, body) {
				if (err) {
					sendResponse.sendErrorsDBError(res, err);
				} else {
					sendResponse.sendObject(res, badgesStringResponse(body));
				}
			});
		});
	};

	// Select a Badge for a sepcified application
	selectBadge = function(req, res) {
		gameEngine.checkExistGameEngine(req, res, function() {
			engine.show('badges', 'allByBadgeID', req.params.id, function(err, doc) {
				if (doc.badge == null) {
					sendResponse.sendErrorsNotFound(res, "Badge not found");
					return;
				}
				sendResponse.sendObject(res, badgeStringResponse(doc.badge));
			});
		});
	};

	// delete a badge for an
	deleteBadge = function(req, res) {
		// Check admin ID
		gameEngine.checkExistGameEngine(req, res, function() {
			engine.show('badges', 'allByBadgeID', req.params.id, function(err, body) {
				if (err) {
					sendResponse.sendErrorsDBError(res, err);
				} else if (body.badge == null) {
					sendResponse.sendWariningDelete(res, "Object Not found");
				} else {
					engine.destroy(body.badge._id, body.badge._rev, function(err, responseTwo) {
						if (err) {
							sendResponse.sendErrorsDBError(res, err);
						} else {
								engine.view('badges', "allEventsBybadgeID", {
								key : [req.params.appid,"event",req.params.id]
							}, function(err, doc) {
								if (err) {
									sendResponse.sendErrorsDBError(res, err);
								} else {
									doc.rows.forEach(function(doc) { 
										engine.destroy(doc.value._id, doc.value._rev);
									});
									var JSONContent = JSON.stringify(responseTwo);
									sendResponse.sendObject(res, JSONContent);
								}
							});
						}
					});
				}
			});
		});
	};

	// update a badge
	updateBadge = function(req, res) {
		// Check admin ID
		var JSONContentBadge = req.body;

		//validate data
		//validate data
		validator.check(req.is('json'), validator.CONTENT_TYPE_NOT_JSON).equals(true);
		if (JSONContentBadge.points)
			validator.check(JSONContentBadge.points, validator.POINTS_NOT_INTEGER).isInt();
		validator.check(JSONContentBadge.name, validator.NAME_EMPTY).notNull();
		validator.check(JSONContentBadge.description, validator.DESCRIPTION_EMPTY).notNull();
		validator.check(JSONContentBadge.URLBadge, validator.URL_BADGE_EMPTY).notNull();
		validator.check(JSONContentBadge.URLBadge, validator.URL_BADGE_NOT_CORRECT).isUrl();
		validator.check(JSONContentBadge.URLBadge).checkIfImage();
		
		// Check if error are found and flush errors
		var errors = validator.getErrors();
		validator.flushErrors();

		if (errors[0] == null) {
			gameEngine.checkExistGameEngine(req, res, function() {
				engine.atomic("badges", "inplace", req.params.id, JSONContentBadge, function(err, doc) {
					if (err) {
						sendResponse.sendErrorsDBError(res, err);
					} else {
						sendResponse.sendObject(res, badgeStringResponse(doc));
					}
				});
			});
		} else {
			sendResponse.sendErrorsBadContent(res, errors);
		}
	};

	//Utils
	checkExistBadge = function(req, res,value, func) {
		engine.show('badges', 'allByBadgeID', value, function(err, response) {
			if (!err) {
				//TODO: Check the security
				JSONContentEngine = response.badge;
				if (JSONContentEngine == null) {
					sendResponse.sendErrorsNotFound(res, "ID for Badge not found");
					return;
				}
				func();
			} else {
				sendResponse.sendErrorsBadContent(res, "Error : Bad Content");
			}
		});
	};
	
	//utils 

		selectbadgeUtils = function(id, func) {
			engine.show('badges', 'allByBadgeID', id, function(err, doc) {
				if (doc.badge == null) {
					sendResponse.sendErrorsNotFound(res, "Badge not found");
				}
				func(badgeResponse(doc.badge));
			});

		}; 

	selectbadgesUtils = function(badgesIDList, func) {
    if(typeof badgesIDList == 'undefined' ){
   func(null);
  }
  else{
   var jsonObj = []; //declare object
   badgesIDList.forEach(function(doc) { 
    jsonObj.push([doc.badgeID]);
   });
   engine.view('badges', "allBadgesByID", {
    "keys" : jsonObj
   }, function(err, body) {
    if (err){
     sendResponse.sendErrorsDBError(res, err);
    }
    else if (body.rows[0] == null) {
      
     func(null);
    }
    else{
     func(badgesResponse(body));
    }
   });
  }
 };


	// Private
	badgeStringResponse = function(doc) {
		var badge = {
			"id" : doc._id,
			"name" : doc.name,
			"description" : doc.description,
			"URLBadge" : doc.URLBadge,
			"points" : doc.points
		};
		return JSON.stringify(badge);
	}
	badgeResponse = function(doc) {
		var badge = {
			"id" : doc._id,
			"name" : doc.name,
			"description" : doc.description,
			"URLBadge" : doc.URLBadge,
			"points" : doc.points
		};
		return badge;
	}
	badgesStringResponse = function(doc) {
		var jsonObj = []; //declare object
		doc.rows.forEach(function(doc) { 
			jsonObj.push({
				"id" : doc.value._id,
				"name" : doc.value.name,
				"description" : doc.value.description,
				"URLBadge" : doc.URLBadge,
				"points" : doc.value.points
			});
		});
		var badges = {
			"badges" : jsonObj
		};
		return JSON.stringify(badges);
	}	
	badgesResponse = function(doc) {
		var jsonObj = []; //declare object
		doc.rows.forEach(function(doc) { 
			jsonObj.push({
				"id" : doc.value._id,
				"name" : doc.value.name,
				"description" : doc.value.description,
				"URLBadge" : doc.URLBadge,
				"points" : doc.value.points
			});
		});
		
		return jsonObj;
	}
	badgeStorage = function(body, appid) {
		var badge = {
			"appID" : appid,
			"type" : 'badge',
			"name" : body.name,
			"description" : body.description,
			"URLBadge" : body.URLBadge,
			"points" : body.points
		}
		return badge;
	}

	return {
		createBadge : createBadge,
		selectBadge : selectBadge,
		updateBadge : updateBadge,
		deleteBadge : deleteBadge,
		selectAllBadges : selectAllBadges,
		checkExistBadge : checkExistBadge,
		selectbadgeUtils: selectbadgeUtils,
		selectbadgesUtils: selectbadgesUtils
	}

});
