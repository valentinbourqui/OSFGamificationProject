// ############################################# START requirejs  #############################################

var requirejs = require('requirejs');

requirejs.config({
	baseUrl: __dirname,
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});

// ############################################# RUN  #############################################

requirejs(['loadRequests','http','https'] ,function(app,http,https){
	

	// Run the server (PORT/IP) http
	// Notify the user	
	http.createServer(app).listen(app.get('port'),app.get('ip'), function () {
	    console.log("Server running at http://"+app.get('ip')+":"+app.get('port'));
	});
	
    // Run the server (PORT/IP) https
	// Notify the user	

	/*var options = {
	  key: "fs.readFileSync('test/fixtures/keys/agent2-key.pem')",
	  cert: "fs.readFileSync('test/fixtures/keys/agent2-cert.pem')"
	};
	https.createServer(options,app).listen(app.get('port2'),app.get('ip'), function () {
	    console.log("Server running at https://"+app.get('ip')+":"+app.get('port2'));
	});*/
 
});

// ############################################# DETECT ERROR  #############################################

requirejs.onError = function (err) {
    console.log(err.requireType);
    if (err.requireType === 'timeout') {
        console.log('Error: modules: ' + err.requireModules);
    }
    throw err;
}




