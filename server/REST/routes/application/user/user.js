define(['../../../tools/engine'], function (engine) {
	 // We define a Badge with a custom view
 	engine.insert(
		{ "views": 
		    { "allUsersByAppID": 
		    	{  
					map: function (doc) {
					  emit([doc.appID,doc.type], doc);
					}
				}
			}
		  , "shows": 
			{ "allByUserID": function(doc, req) 
				{
       				return { body: JSON.stringify({ user : doc }) };
				}
			}
		, "updates": 
			{ "inplace": function(doc, req) 
				{
       				 var body = JSON.parse(req.body);
          			 doc.points = body.points;
          			 doc.badgesIDList = body.badgesIDList;
          			 doc.levelID = body.levelID;
          			 return [doc, JSON.stringify(doc)];
				}
			}
		}, '_design/users'
	);
});