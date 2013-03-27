define(['../../../tools/engine','../../../tools/validatorContent','../../../tools/sendResponse'],function (engine,validator,sendResponse) {

	
	// Create a new game engine
	createGameEngine =  function(req, res){
		    
	    var JSONContent;
		req.on('data', function (chunk) {
		    JSONContent = JSON.parse(chunk);     

		    //validate data
			validator.check(JSONContent.name,"Name is empty").notNull();
			validator.check(JSONContent.description,"Description is empty").notNull();
			
			// Check if error are found and flush errors
			var errors = validator.getErrors(); 
			validator.flushErrors();
			
			//Generate the secure key 
			// Check the security on game engine per user
		    
		    // TODO 

			if(errors[0] == null){
				engine.save({"type": 'gameEngine' ,"content" : [JSONContent]}, function (err, response) {
					      if(err){
					      	sendResponse.sendErrorsDBError(res,err);
					      }
					      else{
					      	// return all information 
					      	
					      	// TODO 
					      	
							var JSONContent = JSON.stringify({"response": response});
							sendResponse.sendObjectCreated(res,JSONContent);					      	
					      }
				});
			}
			else{
				sendResponse.sendErrorsBadContent(res,errors);
			}
		});
	};

	
	
	// Select a game engine
	selectGameEngine = function(req, res){
		 // Check the security
		    
		 // TODO 
		 
		// Check admin ID 
		validator.check(req.params.appid, "Appid invalid integer").isInt();
		validator.check(req.params.appid).valideAppID();
			
		// Check if error are found and flush errors
		var errors = validator.getErrors(); 
		validator.flushErrors();		
		if(errors[0] == null){
			engine.view('level/allByGameEngineID',  { key: req.params.appid }, function (err, response) {
			 	if(err){
				  	sendResponse.sendErrorsDBError(res,err);
				}
				else{
					var JSONContent = JSON.stringify(response);
					sendResponse.sendObject(res,JSONContent);					      	
				}
			  });
		} 
		else{	
			sendResponse.sendErrorsBadContent(res,errors);
		}
	};
	
	// delete a game engine
	deleteGameEngine = function(req, res){
		 // Check the security 
		    
		 // TODO 
		 
		// Check admin ID 
		validator.check(req.params.appid, "Appid invalid integer").isInt();
		validator.check(req.params.appid).valideAppID();
			
		// Check if error are found and flush errors
		var errors = validator.getErrors(); 
		validator.flushErrors();		
		if(errors[0] == null){
			engine.view('level/allByLevelID',  { key: req.params.id }, function (err, response) {
			
			 	if(err){
				  	sendResponse.sendErrorsDBError(res,err);
				}
				else if(response[0] == null){
				  	sendResponse.sendWariningDelete(res,"Object Not found");
				}
				else{		   
					response.forEach(function (key, row, id) {
				         engine.remove(id,row._rev, function (err, responseTwo) {
						 	if(err){
							  	sendResponse.sendErrorsDBError(res,err);
							}
							else{
								var JSONContent = JSON.stringify(responseTwo);
								sendResponse.sendObject(res,JSONContent);					      	
							}
						  });
				    });				      	
				}
			  });	
		} 
		else{	
			sendResponse.sendErrorsBadContent(res,errors);
		}
	};
		
	// Update a game engine
	updateGameEngine = function(req, res){    
	    var JSONContent;
		req.on('data', function (chunk) {
		    JSONContent = JSON.parse(chunk);     
            console.log();
		    // Check the security
		    
		    // TODO 
		    
		    //validate data
			validator.check(JSONContent.points, "Points is empty").notNull();
			validator.check(JSONContent.points, "Points invalid integer").isInt();
			validator.check(JSONContent.name,"Name is empty").notNull();
			validator.check(JSONContent.description,"Description is empty").notNull();
			
			// Check admin ID 
			validator.check(req.params.appid, "Appid invalid integer").isInt();
			validator.check(req.params.appid).valideAppID();
			
			// Check if error are found and flush errors
			var errors = validator.getErrors(); 
			validator.flushErrors();

			if(errors[0] == null){
				engine.view('level/allByLevelID',  { key: req.params.id }, function (err, response) {
			
				 	if(err){
					  	sendResponse.sendErrorsDBError(res,err);
					}
					else if(response[0] == null){
					  	sendResponse.sendWariningDelete(res,"Object Not found");
					}
					else{		   	
						engine.save(req.params.id, {"appID": req.params.appid, "type": 'level' ,"content" : [JSONContent]}, function (err, response) {
							      if(err){
							      	sendResponse.sendErrorsDBError(res,err);
							      }
							      else{
									var JSONContent = JSON.stringify({"response": response});
									sendResponse.sendObject(res,JSONContent);					      	
							      }
						});
					}
				});
			}
			else{
				
				sendResponse.sendErrorsBadContent(res,errors);
			}
		});
	};
	
	
    return {
    	createGameEngine: createGameEngine,
        selectGameEngine: selectGameEngine,
        deleteGameEngine: deleteGameEngine,
        updateGameEngine: updateGameEngine
    }
   
});

