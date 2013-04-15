define(['express','../variables/expressVariables'], function (express,expressVariables) {
    
    var app = express();
		
	// ############################################# EXEPRESS CONFIGURATION #############################################

	// Error handling
	function logErrors(err, req, res, next) {
	  console.error(err.stack);
	  next(err);
	}
	
	function clientErrorHandler(err, req, res, next) {
	  if (req.xhr) {
	    res.send(500, { error: 'Something blew up!' });
	  } else {
	    next(err);
	  }
	}

	function errorHandler(err, req, res, next) {
	  res.status(500);
	  res.render('error :', { error: err });
	}
		
	// Configure server
	app.configure(function() {
		app.set('port', process.env.PORT || expressVariables.PORT);
		app.set('port2',  expressVariables.PORT2);
		app.set('ip', expressVariables.IP);
	    app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
	    app.use(express.bodyParser());
	    app.use(express.cookieParser());
	    app.use(express.session({ secret: 'cool beans' }));
	    app.use(express.methodOverride());
	    app.use(expressVariables.allowCrossDomain);
	    app.use(app.router);
	    app.use(express.static(expressVariables.__dirname + '/public'));
	    app.use(logErrors);
		app.use(clientErrorHandler);
		app.use(errorHandler);
		app.use(express.session({
			secret: "skjghskdjsddfpsllwwbqigohqdiouk"
		}));
	});
	

    return app;
});