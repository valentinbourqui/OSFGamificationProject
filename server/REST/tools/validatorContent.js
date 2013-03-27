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
	 	if(this.asyncvalideAppID(this.str) == true){
	 		this.error('AppID invalide not found' );
	 	}
 	
	}
	
    Validator.prototype.asyncvalideAppID = function(str) {

 	engine.view('gamEngine/allByGameEngineID',  { key: str }, function (err, response) {
			 	if(err || response[0] == null){
			 		    	console.log(response[0]);
				  	return true;
				}
				else{
						console.log(response[0]);
					return false;
				}
		});
	}
	
	
 	// TODO
	
	

	return new Validator();
});

