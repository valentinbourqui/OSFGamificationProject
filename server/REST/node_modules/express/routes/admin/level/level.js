define(['../../../tools/engine'], function (engine) {
	
    // We define a Person with a custom view
	engine.save('_design/level', {
	      allByAppID: {
	          map: function (doc) {
	              if (doc.type =="level") emit(doc.appID, doc);
	          }
	      },
	      allByLevelID: {
	          map: function (doc) {
	              if (doc.type =="level") emit(doc._id, doc);
	          }
	      }
  	});
});
