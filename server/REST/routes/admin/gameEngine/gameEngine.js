define(['../../../tools/engine'], function (engine) {
	
    // We define a game engine with a custom view
	engine.save('_design/gamEngine', {
	      allByGameEngineID: {
	          map: function (doc) {
	              if (doc.type =="gameEngine") emit(doc._id, doc);
	          }
	      }
  	});
});
