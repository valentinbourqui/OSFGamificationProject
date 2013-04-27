var engine ;
 
define(['../variables/cradleVariables'], function (cradleVariables) {
	
	
    if(nano == null){
    	var nano = require('nano')("http://"+cradleVariables.host+":"+cradleVariables.port)
    	, username = cradleVariables.user
		, userpass = cradleVariables.password 
		, callback = console.log // this would normally be some callback
		, cookies  = {} // store cookies, normally redis or something
		;
	    require('./routes/admin/gameEngine/gameEngine');
		nano.db.create('osf_database', function(err, body) {
			  if (!err) {
  				  console.log('database created.');
			      require('./routes/admin/gameEngine/gameEngine');
			      console.log('Views game engine created.');
			      require('./routes/admin/level/level');
			      console.log('Views levels created.');
			      require('./routes/admin/badge/badge');
			      console.log('Views badges created.');
			 }

		});
		engine = nano.use('osf_database');
    /*	cradle.setup({
		    host: cradleVariables.host,
		    port: cradleVariables.port,
		    cache: true,
		    raw: false,
		    auth: { username: cradleVariables.user, password: cradleVariables.password }
		});*/
		
		//var c = new(cradle.Connection);
		//engine = c.database(cradleVariables.database);
		
		// check if the database existe.
	/*	nano.db.
		engine.exists(function (err, exists) {
		    if (err) {
		      console.log('error', err);
		    } 
		    // create the database and Views 
		    else if (!exists) {
		      console.log('database does not exists.');
		      engine.create();
		      console.log('database created.');
		      require('./routes/admin/gameEngine/gameEngine');
		      console.log('Views game engine created.');
		      require('./routes/admin/level/level');
		      console.log('Views levels created.');
		    }
	  	});
	}*/
	
	}
    return engine;

});



