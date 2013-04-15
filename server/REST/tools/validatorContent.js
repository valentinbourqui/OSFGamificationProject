define(['./engine','validator'],function (engine,check) {
	// Collect errors instead of throwing each time
	var Validator = check.Validator;
	
	// Collect errors 
	Validator.prototype.error = function (msg) {
   	 	this._errors.push(msg);
   	 	return this;
	}

	Validator.prototype.getErrors = function () {
   		 return this._errors;
	}
	
	Validator.prototype.flushErrors = function () {
   		 this._errors = null;
	}
	
 	// Create your own validators 
 	Validator.prototype.valideAppID = function() {
	 	engine.view('gamEngine', 'allByGameEngineID',  { key: this.str }, function (err, response) {
	 		 			  console.log('database created.');

				 	if(err || response[0] == null){
					    return false;
					}
					else{
						return true;
					}
			});
				 
	}

	
 	// TODO
	
	

	return new Validator();
});

