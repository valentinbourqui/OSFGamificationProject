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

	
 	// TODO
	
	

	return new Validator();
});

