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
		}, '_design/users'
	);
});