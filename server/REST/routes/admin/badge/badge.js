define(['../../../tools/engine'], function (engine) {
	 // We define a Badge with a custom view
 	engine.insert(
		{ "views": 
		    { "allBadgesByAppID": 
		    	{  
					map: function (doc,req) {
					  emit([doc.appID,doc.type], doc);
					}
				}
			
		  ,"allEventsBybadgeID": 
		    	{  
					map: function (doc,req) {
					  emit([doc.appID,doc.type,doc.value], doc);
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
          			 doc.URLBadge = body.URLBadge;
          			 doc.points = body.points;
          			 return [doc, JSON.stringify(doc)];
				}
			}
		}, '_design/badges'
	);
});
