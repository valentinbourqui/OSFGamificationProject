define(function () {
	
	// Send errors or ack
	
	sendErrorsBadContent = function (res,errors) {
         res.writeHead(400, {"Content-Type" : "application/json"});
		 res.write(JSON.stringify({"Error": [{ "Type":"Bad Content", "Description": errors }]}));
		 res.end();
	}
	
	sendErrorsNotFound = function (res,errors) {
         res.writeHead(404, {"Content-Type" : "application/json"});
		 res.write(JSON.stringify({"Error": [{ "Type":"Ressource not found", "Description": errors }]}));
		 res.end();
	}
	
	sendErrorsDBError = function (res,errors) {
         res.writeHead(400, {"Content-Type" : "application/json"});
		 res.write(JSON.stringify({"Error": [{ "Type":"couchDB Error", "Description": errors }]}));
		 res.end();
	}	
	
	sendWariningDelete = function (res,errors) {
         res.writeHead(400, {"Content-Type" : "application/json"});
		 res.write(JSON.stringify({"Warning": [{ "Type":"couchDB Warning", "Description": errors }]}));
		 res.end();
	}	
	
	sendObjectCreated = function (res,JSONContent) {
         res.writeHead(201, {"Content-Type" : "application/json"});
		 res.write(JSONContent);
		 res.end();
	}
	
	sendObject = function (res,JSONContent) {
         res.writeHead(200, {"Content-Type" : "application/json"});
		 res.write(JSONContent);
		 res.end();
	}
	
	 return {
    	sendObjectCreated: sendObjectCreated,
        sendErrorsBadContent: sendErrorsBadContent,
        sendErrorsNotFound: sendErrorsNotFound,
        sendWariningDelete : sendWariningDelete,
        sendErrorsDBError : sendErrorsDBError,
        sendObject: sendObject
    }
});
