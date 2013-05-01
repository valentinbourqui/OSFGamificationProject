// ############################################# EXPRESS VARIABLES #############################################

// connexion information
define(function () {
    var PORT = 3000,
    PORT2 = 443,
    IP = "127.0.0.10",
	__dirname = process.cwd(),
	 // Configure express for CrossDomain 
    allowCrossDomain = function(req, res, next) {
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Origin', "*");
		res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');  // res.set('Access-Control-Allow-Max-Age', 3600);
		 // intercept OPTIONS method
		if ('OPTIONS' == req.method) {
			res.send(200);
		}
		else {
			next();
		}
	}
    return {
        PORT : PORT,
        PORT2 : PORT2,
	    IP : IP ,
	    __dirname : __dirname,
	    allowCrossDomain: allowCrossDomain }
});