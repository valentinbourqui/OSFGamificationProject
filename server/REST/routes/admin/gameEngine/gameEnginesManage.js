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
				engine.insert({"type": 'gameEngine' ,"content" : [JSONContent]}, function (err, response) {
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
		
	};
	
	// delete a game engine
	deleteGameEngine = function(req, res){
		 // Check the security 
	
	};
		
	// Update a game engine
	updateGameEngine = function(req, res){    
	
	};
	
	
    return {
    	createGameEngine: createGameEngine,
        selectGameEngine: selectGameEngine,
        deleteGameEngine: deleteGameEngine,
        updateGameEngine: updateGameEngine
    }
   
});

