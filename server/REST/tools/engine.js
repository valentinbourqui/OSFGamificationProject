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
	}
	
    return engine;

});



