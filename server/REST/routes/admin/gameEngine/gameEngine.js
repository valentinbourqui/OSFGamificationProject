define(['../../../tools/engine'], function (engine) {
	
    // We define a game engine with a custom view
     engine.insert(
		  { "views": 
		    { "allObjcetsByAppID": 
		    	{  
					map: function (doc) {
						emit([doc.appID], doc);
					}
				}
			}
		  , "shows": 
		    { "allByGameEngineID": function(doc, req) 
				{
       				return { body: JSON.stringify({ gameEngine : doc }) };
				}
			}
		   , "updates": 
			{ "inplace": function(doc, req) 
				{
       				 var body = JSON.parse(req.body);
          			 doc.name = body.name;
          			 doc.description = body.description;
          			 return [doc, JSON.stringify(doc)];
				}
			}
		}, '_design/gameEngines'
	);
});
