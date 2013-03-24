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
 		// TODO
	    if (false) {
	        this.error(this.msg || 'AppID invalide not found ' + this.str);
	    }
	    return this; //Allow method chaining
	}
	
	
 	// TODO
	
	

	return new Validator();
});

