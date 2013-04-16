define(['../../../tools/engine'], function (engine) {
	 // We define a Level with a custom view
 	engine.insert(
		{ "views": 
		    { "allLevelsByAppID": 
		    	{  
					map: function (doc,req) {
					   var body = JSON.parse(req.body);
					   if (doc.type =="level" && body.key == doc.appID) emit(doc.appID, doc);
					}
				}
			}
		  , "shows": 
			{ "allByLevelID": function(doc, req) 
				{
       				return { body: JSON.stringify({ level : doc }) };
				}
			}
			
		 , "updates": 
			{ "inplace": function(doc, req) 
				{
       				 var body = JSON.parse(req.body);
          			 doc.content[0].name = body.name;
          			 doc.content[0].description = body.description;
          			 doc.content[0].points = body.points;
          			 return [doc, JSON.stringify(doc)];
				}
			}
		}, '_design/levels'
	);
});
