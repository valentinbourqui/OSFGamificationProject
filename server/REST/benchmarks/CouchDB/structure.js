define(['./engine'], function(dbCouchDB) {

	//GameEngine
	dbCouchDB.insert({
		"views" : {
			"allObjcetsByAppID" : {
				map : function(doc) {
					emit([doc.appID], doc);
				}
			}
		},
		"shows" : {
			"allByGameEngineID" : function(doc, req) {
				return {
					body : JSON.stringify({
						gameEngine : doc
					})
				};
			}
		},
		"updates" : {
			"inplace" : function(doc, req) {
				var body = JSON.parse(req.body);
				doc.name = body.name;
				doc.description = body.description;
				return [doc, JSON.stringify(doc)];
			}
		}
	}, '_design/gameEngines');

	//Level
	dbCouchDB.insert({
		"views" : {
			"allLevelsByAppID" : {
				map : function(doc) {
					emit([doc.appID, doc.type], doc);
				}
			}
		},
		"shows" : {
			"allByLevelID" : function(doc, req) {
				return {
					body : JSON.stringify({
						level : doc
					})
				};
			}
		},
		"updates" : {
			"inplace" : function(doc, req) {
				var body = JSON.parse(req.body);
				doc.name = body.name;
				doc.description = body.description;
				doc.points = body.points;
				return [doc, JSON.stringify(doc)];
			}
		}
	}, '_design/levels');

	//Badge
	dbCouchDB.insert({
		"views" : {
			"allBadgesByAppID" : {
				map : function(doc, req) {
					emit([doc.appID, doc.type], doc);
				}
			},
			"allEventsBybadgeID" : {
				map : function(doc, req) {
					emit([doc.appID, doc.type, doc.value], doc);
				}
			},
			"allBadgesByID" : {
				map : function(doc, req) {
					emit([doc._id], doc);
				}
			}
		},
		"shows" : {
			"allByBadgeID" : function(doc, req) {
				return {
					body : JSON.stringify({
						badge : doc
					})
				};
			}
		},
		"updates" : {
			"inplace" : function(doc, req) {
				var body = JSON.parse(req.body);
				doc.name = body.name;
				doc.description = body.description;
				doc.URLBadge = body.URLBadge;
				doc.points = body.points;
				return [doc, JSON.stringify(doc)];
			}
		}
	}, '_design/badges');

}); 