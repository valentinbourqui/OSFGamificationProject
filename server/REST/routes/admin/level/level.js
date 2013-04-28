define(['../../../tools/engine'], function (engine) {
	 // We define a Level with a custom view
 	engine.insert(
		{ "views": 
		    { "allLevelsByAppID": 
		    	{  
					map: function (doc) {
					 emit([doc.appID,doc.type], doc);
					}
				}
			}
		  ,"views": 
		    { "selectFirstLevel": 
		    	{  
					map: function (doc) {
					 emit([doc.appID,doc.type,doc.points], doc);
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
          			 doc.name = body.name;
          			 doc.description = body.description;
          			 doc.points = body.points;
          			 return [doc, JSON.stringify(doc)];
				}
			}
		}, '_design/levels'
	);
});
