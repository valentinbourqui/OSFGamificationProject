define(['./tools/app',
		'./routes/admin/level/levelsManage',
		'./routes/admin/badge/badgesManage',
		'./routes/admin/event/eventsManage',
	    './routes/application/user/usersManage',
	    './routes/application/event/eventsManage',
	    './routes/application/leaderboard/leaderboardsManage',
		'./routes/admin/gameEngine/gameEnginesManage'
		], 
		function (
		app,
		adminLevels,
		adminBadges,
		adminEvents,
		appUser,
		appEvent,
		appLeaderboard,
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

	// Badges call and manage
	app.post("/admin/:appid/badge",adminBadges.createBadge);
	app.get('/admin/:appid/badge/:id',adminBadges.selectBadge);
	app.put('/admin/:appid/badge/:id',adminBadges.updateBadge);
	app.delete('/admin/:appid/badge/:id',adminBadges.deleteBadge);
	app.get('/admin/:appid/badges',adminBadges.selectAllBadges);
	
	// Events call and mange 	
	app.post("/admin/:appid/event",adminEvents.createEvent);
	app.get('/admin/:appid/event/:id',adminEvents.selectEvent);
	app.put('/admin/:appid/event/:id',adminEvents.updateEvent);
	app.delete('/admin/:appid/event/:id',adminEvents.deleteEvent);
	app.get('/admin/:appid/events',adminEvents.selectAllEvents);	
	
	// ############################################# DEFINE RESQUESTS FOR CLIENT SIDE #############################################
		
    // user call and manage
	app.post("/app/:appid/user",appUser.createUser);
	app.get('/app/:appid/user/:id',appUser.selectUser);
	app.delete('/app/:appid/user/:id',appUser.deleteUser);
	
	// event call and manage
	app.post('/app/:appid/user/:userid/event',appEvent.notifyEvent);
	
	// leaderboard call and manage
	app.get('/app/:appid/leaderboard',appLeaderboard.selectLeaderboard);
	
	return app;
});
