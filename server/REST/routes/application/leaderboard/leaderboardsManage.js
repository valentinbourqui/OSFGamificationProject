define(['../../../tools/engine', 
		'../../../tools/validatorContent',
		'../../../tools/sendResponse', 
		'../../admin/gameEngine/gameEnginesManage',
	    '../user/usersManage',
		], function(engine, validator, sendResponse, gameEngine,userManage) {


	selectLeaderboard = function(req, res) {
		gameEngine.checkExistGameEngine(req, res, function() {
			userManage.allUsersByAppID(req,res, function(users) {
				gameEngine.selectGameEngineUtils(req, res, function(gameEngine) {
					sendResponse.sendObject(res,leaderBoardResponse(gameEngine,users));
				});
			});
		});	
	};

	//private 
	leaderBoardResponse = function(doc,users) {
		resObject = {
			"name" : doc.name,
			"description" : doc.description,
			"users": users
		};
		return JSON.stringify(resObject);
	}


	return {
		selectLeaderboard:selectLeaderboard
	}
});
