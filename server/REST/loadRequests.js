define(['./tools/app',
		'./routes/admin/level/levelsManage',
		'./routes/admin/gameEngine/gameEnginesManage'
		], 
		function (
		app,
		adminLevels,
		adminGameEngine
		) {
			
	
	// ############################################# DEFINE RESQUESTS FOR ADMIN SIDE  #############################################
	
	// game engine call and manage
	app.post("/admin/game_engine",adminGameEngine.createGameEngine);
	app.get('/admin/game_engine/:appid',adminGameEngine.selectGameEngine);
	app.put('/admin/game_engine/:appid',adminGameEngine.updateGameEngine);
	app.delete('/admin/game_engine/:appid',adminGameEngine.deleteGameEngine);
	
	// Levels call and manage
	app.post("/admin/:appid/level",adminLevels.createLevel);
	app.get('/admin/:appid/level/:id',adminLevels.selectLevel);
	app.put('/admin/:appid/level/:id',adminLevels.updateLevel);
	app.delete('/admin/:appid/level/:id',adminLevels.deleteLevel);
	app.get('/admin/:appid/levels',adminLevels.selectAllLevels);
	
	// ############################################# DEFINE RESQUESTS FOR CLIENT SIDE #############################################
		
	return app;
});