define(['../../../tools/engine', 
		'../../../tools/validatorContent',
		 '../../../tools/sendResponse',
		  '../../admin/gameEngine/gameEnginesManage',
		  '../user/usersManage',
		  '../../admin/event/eventsManage',],
		  function(engine,
		  validator,
		  sendResponse,
		  gameEngine,
		  userManage,
		  eventManage) {

	// fire an event for for a sepcified application
	notifyEvent = function(req, res) {
		var JSONContent = req.body;

		//validate data
		validator.check(JSONContent.eventId, validator.EVENT_ID_EMPTY).notNull();

		// Check if error are found and flush errors
		var errors = validator.getErrors();
		validator.flushErrors();
		gameEngine.checkExistGameEngine(req, res, function() {
			userManage.checkExistUser(req, res, function(user) {
				eventManage.checkExistEvents(req, res,JSONContent.eventId, function(event) {
					if(event.eventType == "point"){
						updateLevel(req,res,user,event);
					}
					else {
						updateBadge(req,res,user,event);
					}
				});
			});
		});
	};

	//private
	updateLevel = function(req,res,user,event){
		user.points = user.points+event.value;
		userManage.updateUserLevel(req,res,user);
	};
	
	updateBadge = function(req,res,user,event){
		
		// TODO FINISH THIS PART 
		
		sendResponse.sendObjectCreated(res, "OK");
	};
	
	
	return {
		notifyEvent : notifyEvent
	}

});
