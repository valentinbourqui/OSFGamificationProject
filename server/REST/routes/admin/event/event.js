define(['../../../tools/engine'], function (engine) {
	 // We define a Badge with a custom view
 	engine.insert(
		{ "views": 
		    { "allEventsByAppID": 
		    	{  
					map: function (doc) {
					  emit([doc.appID,doc.type], doc);
					}
				}
			
		  , "allEventsByEventID": 
		    	{  
					map: function (doc) {
					  emit([doc.appID,doc.type,doc.eventId], doc);
					}
				}
			}
		  ,
		   "shows": 
			{ "allByeventID": function(doc, req) 
				{
       				return { body: JSON.stringify({ event : doc }) };
				}
			}
			
		 , "updates": 
			{ "inplace": function(doc, req) 
				{
       				 var body = JSON.parse(req.body);
          			 doc.name = body.name;
          			 doc.description = body.description;
          			 doc.eventId = body.eventId;
          			 doc.eventType = body.eventType;
          			 doc.value = body.value;
          			 return [doc, JSON.stringify(doc)];
				}
			}
		}, '_design/events'
	);
});
