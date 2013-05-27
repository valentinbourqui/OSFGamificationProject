var APIeasy = require('api-easy'),
      assert = require('assert');

var suite = APIeasy.describe('Test of a the API of the Gamification project');
var app_id = 'ba66c9d2c459cabad838032a86013d5f';
var badge_id = 'ba66c9d2c459cabad838032a86030b4d';
var level_id = 'ba66c9d2c459cabad838032a86046a13';
var event_id = 'ba66c9d2c459cabad838032a8608580b';
var user_id = 'ba66c9d2c459cabad838032a86030b4d';

//##########################################
// ------------- ADMIN SIDE ------------
//##########################################

suite.discuss('ADMIN_side')
	.discuss('Create Game Engine')
	.use('127.0.0.10', 3000)
	.setHeader('Content-Type', 'application/json')
	.post('/admin/game_engine', { name: 'MyNewGameEngine', description: 'this is a test game engine' })
	.expect(201)
	.expect('should respond with id, name, description, APIKey, secureKey', function(err, res, body){
		var game_engine = JSON.parse(body);
		app_id = game_engine.id;
		assert.isNotNull(game_engine.id);
		assert.isNotNull(game_engine.name);
		assert.isNotNull(game_engine.description);
		console.log("AppID: "+app_id)
	})
.undiscuss()

.next()
.discuss('When getting game engine '+ app_id + ' details:')
  .removeHeader('Content-Type', 'application/json')
  .get('/admin/game_engine/'+ app_id)
  .expect(200)
  .expect('should respond with id, name, description, APIKey, secureKey', function(err, res, body){
		var game_engine = JSON.parse(body);
		app_id = game_engine.id;
		assert.isNotNull(game_engine.id);
		assert.isNotNull(game_engine.name);
		assert.isNotNull(game_engine.description);
	})
.undiscuss()
//##########################################
// BADGE
//##########################################
.next()
.discuss('When creating a badge')
	.setHeader('Content-Type', 'application/json')
	.post('/admin/'+app_id+'/badge', { name: 'badge_01', description: 'My first badge', URLBadge: 'www.test.com/lala.png' })
	.expect(201)
	.expect('should respond with id, name, description, URL, points', function(err, res, body){
		var badge = JSON.parse(body);
		var badge_id = badge.id;
		assert.isNotNull(badge.id);
		assert.isNotNull(badge.name);
		assert.isNotNull(badge.description);
		assert.isNotNull(badge.URLBadge);
		console.log("badgeID: "+badge_id)
	})
.undiscuss()

.next()
.discuss('When getting badge '+ badge_id + ' details:')
  .removeHeader('Content-Type', 'application/json')
  .get('/admin/'+app_id+'/badge/'+badge_id)
  .expect(200)
  .expect('should respond with id, name, description, APIKey, secureKey', function(err, res, body){
		var game_engine = JSON.parse(body);
		app_id = game_engine.id;
		assert.isNotNull(game_engine.id);
		assert.isNotNull(game_engine.name);
		assert.isNotNull(game_engine.description);
	})
.undiscuss()

.next()
.discuss('When getting all (list of) badges')
  .removeHeader('Content-Type', 'application/json')
  .get('/admin/'+app_id+'/badges')
  .expect(200)
  .expect('should respond with an array of badge', function(err, res, body){
		var badges = JSON.parse(body);
		assert.isArray(badges.badges);
	})
.undiscuss()
//##########################################
// LEVEL
//##########################################
.next()
.discuss('When creating a level')
	.setHeader('Content-Type', 'application/json')
	.post('/admin/'+app_id+'/level', { name: 'level_01', description: 'Level Description', points: '20' })
	.expect(201)
	.expect('should respond with id, name, description, points', function(err, res, body){
		var level = JSON.parse(body);
		var level_id = level.id;
		assert.isNotNull(level.id);
		assert.isNotNull(level.name);
		assert.isNotNull(level.description);
		assert.isNotNull(level.points);
		console.log("levelID: "+level_id)
	})
.undiscuss()

.next()
.discuss('When getting level '+ level_id + ' details:')
  .removeHeader('Content-Type', 'application/json')
  .get('/admin/'+app_id+'/level/'+level_id)
  .expect(200)
  .expect('should respond with id, name, description, points', function(err, res, body){
		var level = JSON.parse(body);
		assert.isNotNull(level.id);
		assert.isNotNull(level.name);
		assert.isNotNull(level.description);
		assert.isNotNull(level.points);
	})
.undiscuss()

.next()
.discuss('When getting all (list of) levels ')
  .removeHeader('Content-Type', 'application/json')
  .get('/admin/'+app_id+'/levels')
  .expect(200)
  .expect('should respond with an array of levels', function(err, res, body){
		var levels = JSON.parse(body);
		assert.isArray(levels.levels);
	})
.undiscuss()
//##########################################
// EVENT
//##########################################
.next()
.discuss('When creating an event')
	.setHeader('Content-Type', 'application/json')
	.post('/admin/'+app_id+'/event', { name: 'event_01', description: 'Event Description', eventId: 'eventID_01', eventType:'badge', value: badge_id })
	.expect(201)
	.expect('should respond with id, name, description, points', function(err, res, body){
		var Event = JSON.parse(body);
		var Event_id = Event.id;
		assert.isNotNull(Event.id);
		assert.isNotNull(Event.name);
		assert.isNotNull(Event.eventID);
		assert.isNotNull(Event.eventType);
		assert.isNotNull(Event.value);
		console.log("EventID: "+Event_id)
	})
.undiscuss()

.next()
.discuss('When getting an event '+ event_id + ' details:')
  .removeHeader('Content-Type', 'application/json')
  .get('/admin/'+app_id+'/event/'+event_id)
  .expect(200)
  .expect('should respond with id, name, description, points', function(err, res, body){
		var Event = JSON.parse(body);
		var Event_id = Event.id;
		assert.isNotNull(Event.id);
		assert.isNotNull(Event.name);
		assert.isNotNull(Event.eventID);
		assert.isNotNull(Event.eventType);
		assert.isNotNull(Event.value);
	})
.undiscuss()

.next()
.discuss('When getting all (list of) events ')
  .removeHeader('Content-Type', 'application/json')
  .get('/admin/'+app_id+'/events')
  .expect(200)
  .expect('should respond with an array of events', function(err, res, body){
		var Events = JSON.parse(body);
		assert.isArray(Events.events);
	})
.undiscuss()
.undiscuss()
//##########################################
// ---------- APPLICATION SIDE -----------
//##########################################
suite.discuss('APP_side')
	.discuss('Create user')
	.use('127.0.0.10', 3000)
	.setHeader('Content-Type', 'application/json')
	.post('/app/'+app_id+'/user', { })
	.expect(201)
	.expect('should respond with id, points', function(err, res, body){
		var user = JSON.parse(body);
		user_id = user.id;
		assert.isNotNull(user.id);
		console.log("UserID: "+app_id)
	})
.undiscuss()

.next()
.discuss('When getting user '+ event_id + ' details:')
  .removeHeader('Content-Type', 'application/json')
  .get('/app/'+app_id+'/user/'+user_id)
  .expect(200)
  .expect('should respond with infos about the user, the level and the badges[]', function(err, res, body){
		var user = JSON.parse(body);
		assert.isNotNull(user.user.id);
		assert.isNotNull(user.user.level);
		assert.isNotNull(user.user.badges);
	})
.undiscuss()

.export(module);