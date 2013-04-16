define(['../../../tools/engine'], function (engine) {
	
    // We define a game engine with a custom view
     engine.insert(
		  { "views": 
		    { "allByGameEngineID": function(doc, req) 
				{
       				return { body: JSON.stringify({ gameEngine : doc }) };
				}
			}
		   , "updates": 
			{ "inplace": function(doc, req) 
				{
       				 var body = JSON.parse(req.body);
          			 doc.content[0].name = body.name;
          			 doc.content[0].description = body.description;
          			 return [doc, JSON.stringify(doc)];
				}
			}
		}, '_design/gameEngines'
	);
 	  
});
