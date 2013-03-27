var engine ;
 
define(['cradle','../variables/cradleVariables'], function (cradle,cradleVariables) {
	
    if(engine == null){
    	cradle.setup({
		    host: cradleVariables.host,
		    port: cradleVariables.port,
		    cache: true,
		    raw: false,
		    auth: { username: cradleVariables.user, password: cradleVariables.password }
		});
		
		var c = new(cradle.Connection);
		engine = c.database(cradleVariables.database);
		
		// check if the database existe.
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
	}
	
	
    return engine;

});



