define(['../../../tools/engine'], function (engine) {
	 // We define a Badge with a custom view
 	engine.insert(
		{ "views": 
		    { "allBadgesByAppID": 
		    	{  
					map: function (doc,req) {
					   var body = JSON.parse(req.body);
					   if (doc.type =="badge" && body.key == doc.appID) emit(doc.appID, doc);
					}
				}
			}
		  , "shows": 
			{ "allByBadgeID": function(doc, req) 
				{
       				return { body: JSON.stringify({ badge : doc }) };
				}
			}
			
		 , "updates": 
			{ "inplace": function(doc, req) 
				{
       				 var body = JSON.parse(req.body);
          			 doc.name = body.name;
          			 doc.description = body.description;
          			 doc.points = body.points;
          			 return [doc, JSON.stringify(doc)];
				}
			}
		}, '_design/badges'
	);
});
