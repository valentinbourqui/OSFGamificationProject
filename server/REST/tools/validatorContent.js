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

	//Personnal check 
	Validator.prototype.checkIfImage = function() {
		this.str.contain
   if (!~this.str.indexOf(".png") && !~this.str.indexOf(".jpg") && !~this.str.indexOf(".jpeg") && !~this.str.indexOf(".gif")) {
        this.error(Validator.prototype.URL_BADGE_NOT_CORRECT);
    }

    return this; //Allow method chaining
}

	Validator.prototype.POINTS_EMPTY = "'Points' is empty";
	Validator.prototype.POINTS_NOT_INTEGER = "'Points' must be an integer";
	Validator.prototype.NAME_EMPTY = "'Name' is empty";
	Validator.prototype.DESCRIPTION_EMPTY = "'Description' is empty";
	Validator.prototype.CONTENT_TYPE_NOT_JSON = "Content-type is not JSON";
	Validator.prototype.URL_BADGE_EMPTY = "'URLBadge' is empty";
	Validator.prototype.URL_BADGE_NOT_CORRECT = "'URLBadge' is not valid : http://URL image (.png, .jpg, .jpg, .gif)";
 	// TODO
	
	return new Validator();
});

