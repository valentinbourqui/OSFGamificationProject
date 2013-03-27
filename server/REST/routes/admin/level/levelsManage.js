define(['../../../tools/engine','../../../tools/validatorContent','../../../tools/sendResponse'],function (engine,validator,sendResponse) {

	
	// Add a level for for a sepcified application
	createLevel =  function(req, res){
	    
	    var JSONContent;
		req.on('data', function (chunk) {
		    JSONContent = JSON.parse(chunk);     
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
				engine.save({"appID": req.params.appid, "type": 'level' ,"content" : [JSONContent]}, function (err, response) {
					      if(err){
					      	sendResponse.sendErrorsDBError(res,err);
					      }
					      else{
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

	// Select all levels for a sepcified application
	selectAllLevels = function(req, res){	
		 // Check the security
		    
		 // TODO 
		 
		// Check admin ID 
		validator.check(req.params.appid, "Appid invalid integer").isInt();
		validator.check(req.params.appid).valideAppID();
			
		// Check if error are found and flush errors
		var errors = validator.getErrors(); 
		validator.flushErrors();		
		if(errors[0] == null){
			engine.view('level/allByAppID',  { key: req.params.appid }, function (err, response) {
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
	
	// Select a level for a sepcified application
	selectLevel = function(req, res){
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
	
	// delete a level for an 
	deleteLevel = function(req, res){
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
		
	// update a level
	updateLevel = function(req, res){    
	    var JSONContent;
		req.on('data', function (chunk) {
		    JSONContent = JSON.parse(chunk);     
            console.log();
		    // Check the login 
		    
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
    	createLevel: createLevel,
        selectLevel: selectLevel,
        updateLevel: updateLevel,
        deleteLevel: deleteLevel,
        selectAllLevels: selectAllLevels
    }
   
});

