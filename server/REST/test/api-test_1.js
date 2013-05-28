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




.export(module);