define(['../../../tools/engine', '../../../tools/validatorContent', '../../../tools/sendResponse', '../gameEngine/gameEnginesManage','../badge/badgesManage'], function(engine, validator, sendResponse, gameEngine,badgeManage) {

	// Add a event for for a sepcified application
	// spécifier dans le HEADER de la requête : Content-Type : application/json
	createEvent = function(req, res) {
		// Check admin ID
		var JSONContentEvent = req.body;

		//validate data
		validator.check(req.is('json'), validator.CONTENT_TYPE_NOT_JSON).equals(true);

		validator.check(JSONContentEvent.name, validator.NAME_EMPTY).notNull();
		validator.check(JSONContentEvent.description, validator.DESCRIPTION_EMPTY).notNull();
		validator.check(JSONContentEvent.eventId, validator.EVENT_ID_EMPTY).notNull();
		validator.check(JSONContentEvent.eventType, validator.EVENT_TYPE_EMPTY).notNull();
		validator.check(JSONContentEvent.eventType).checkEventType();	
		validator.check(JSONContentEvent.value, validator.VALUE_EMPTY).notNull();  
		if (JSONContentEvent.eventType == "point")
			validator.check(JSONContentEvent.value, validator.VALUE_NOT_INTEGER).isInt();  
    
		// Check if error are found and flush errors
		var errors = validator.getErrors();
		validator.flushErrors();

		if (errors[0] == null) {
			if(JSONContentEvent.eventType == "badge"){
				badgeManage.checkExistBadge(req, res, JSONContentEvent.value, function() {
					gameEngine.checkExistGameEngine(req, res, function() {
						engine.insert(eventStorage(JSONContentEvent, req.params.appid), function(err, resp) {
							if (err) {
								sendResponse.sendErrorsDBError(res, err);
							} else {
								engine.show('events', 'allByeventID', resp.id, function(err, doc) {
									sendResponse.sendObjectCreated(res, eventStringResponse(doc.event));
								});
							}
						});
					});
				});
			}
			else{
				gameEngine.checkExistGameEngine(req, res, function() {
					engine.insert(eventStorage(JSONContentEvent, req.params.appid), function(err, resp) {
						if (err) {
							sendResponse.sendErrorsDBError(res, err);
						} else {
							engine.show('events', 'allByeventID', resp.id, function(err, doc) {
								sendResponse.sendObjectCreated(res, eventStringResponse(doc.event));
							});
						}
					});
				});
			}
		} else {
			sendResponse.sendErrorsBadContent(res, errors);
		}
	};

	// Select all events for a sepcified application
	selectAllEvents = function(req, res) {
		gameEngine.checkExistGameEngine(req, res, function() {
			engine.view('events', "allEventsByAppID", {
				key : [req.params.appid,"event"]
			}, function(err, body) {
				
				if (err) {
					sendResponse.sendErrorsDBError(res, err);
				} else {
					sendResponse.sendObject(res, eventsStringResponse(body));
				}
			});
		});
	};

	// Select a event for a sepcified application
	selectEvent = function(req, res) {
		gameEngine.checkExistGameEngine(req, res, function() {
				engine.show('events', 'allByeventID', req.params.id, function(err, doc) {
				if (doc.event == null) {
					sendResponse.sendErrorsNotFound(res, "Event not found");
					return;
				}
				sendResponse.sendObject(res, eventStringResponse(doc.event));
			});
		});
	};

	// delete a event for an
	deleteEvent = function(req, res) {
		// Check admin ID
    	gameEngine.checkExistGameEngine(req, res, function() {
			engine.show('events', 'allByeventID', req.params.id, function(err, body) {
				if (err) {
					sendResponse.sendErrorsDBError(res, err);
				} else if (body.event == null) {
					sendResponse.sendWariningDelete(res, "Object Not found");
				} else {
					engine.destroy(body.event._id, body.event._rev, function(err, responseTwo) {
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

	// update a event
	updateEvent = function(req, res) {
		// Check admin ID
		var JSONContentEvent = req.body;

		//validate data
		validator.check(req.is('json'), validator.CONTENT_TYPE_NOT_JSON).equals(true);

		validator.check(JSONContentEvent.name, validator.NAME_EMPTY).notNull();
		validator.check(JSONContentEvent.description, validator.DESCRIPTION_EMPTY).notNull();
		validator.check(JSONContentEvent.eventId, validator.EVENT_ID_EMPTY).notNull();
		validator.check(JSONContentEvent.eventType, validator.EVENT_TYPE_EMPTY).notNull();
		validator.check(JSONContentEvent.eventType).checkEventType();	
		validator.check(JSONContentEvent.value, validator.VALUE_EMPTY).notNull();  
		if (JSONContentEvent.eventType == "point")
			validator.check(JSONContentEvent.value, validator.VALUE_NOT_INTEGER).isInt();  
    
		// Check if error are found and flush errors
		var errors = validator.getErrors();
		validator.flushErrors();

		if (errors[0] == null) {
			if(JSONContentEvent.eventType == "badge"){
				badgeManage.checkExistBadge(req, res, JSONContentEvent.value, function() {
					gameEngine.checkExistGameEngine(req, res, function() {
						engine.atomic("events", "inplace", req.params.id, JSONContentEvent, function(err, doc) {
							if (err) {
								sendResponse.sendErrorsDBError(res, err);
							} else {
								sendResponse.sendObject(res, eventStringResponse(doc));
							}
						});
					});
				});
			}
			else{
				gameEngine.checkExistGameEngine(req, res, function() {
					engine.atomic("events", "inplace", req.params.id, JSONContentEvent, function(err, doc) {
						if (err) {
							sendResponse.sendErrorsDBError(res, err);
						} else {
							sendResponse.sendObject(res, eventStringResponse(doc));
						}
					});
				});
			}
		} else {
			sendResponse.sendErrorsBadContent(res, errors);
		}
	};

	// Private
	eventStringResponse = function(doc) {
		var event = {
			"id" : doc._id,
			"name" : doc.name,
			"description" : doc.description,
			"eventId" : doc.eventId,
			"eventType" : doc.eventType,
			"value" : doc.value
		};
		return JSON.stringify(event);
	}
	eventsStringResponse = function(doc) {
		var jsonObj = []; //declare object
		doc.rows.forEach(function(doc) { 
			jsonObj.push({
				"id" : doc.value._id,
				"name" : doc.value.name,
				"description" : doc.value.description,
				"eventId" : doc.value.eventId,
				"eventType" : doc.value.eventType,
				"value" : doc.value.value
			});
		});
		var events = {
			"events" : jsonObj
		};
		return JSON.stringify(events);
	}
	eventStorage = function(body, appid) {
		var event = {
			"appID" : appid,
			"type" : 'event',
			"name" : body.name,
			"description" : body.description,
			"eventId" : body.eventId,
			"eventType" : body.eventType,
			"value" : body.value
		}
		return event;
	}

	return {
		createEvent : createEvent,
		selectEvent : selectEvent,
		updateEvent : updateEvent,
		deleteEvent : deleteEvent,
		selectAllEvents : selectAllEvents
	}

});

