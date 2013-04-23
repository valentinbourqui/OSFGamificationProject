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

	Validator.prototype.POINTS_EMPTY = "'Points' is empty";
	Validator.prototype.POINTS_NOT_INTEGER = "'Points' must be an integer";
	Validator.prototype.NAME_EMPTY = "'Name' is empty";
	Validator.prototype.DESCRIPTION_EMPTY = "'Description' is empty";
	Validator.prototype.CONTENT_TYPE_NOT_JSON = "Content-type is not JSON";
	Validator.prototype.URL_BADGE_EMPTY = "'URLBadge' is empty";
	
 	// TODO
	
	return new Validator();
});

