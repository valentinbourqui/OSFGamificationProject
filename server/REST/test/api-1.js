 var APIeasy = require('api-easy'),
      assert = require('assert');

  var suite = APIeasy.describe('Test of a simple API request');

  suite.discuss('When using your awesome API')
       .discuss('and your awesome resource')
       .use('127.0.0.10', 3000)
       .setHeader('Content-Type', 'application/json')
       .post('/admin/game_engine', { name: 'MyNewGameEngine', description: 'this is a test game engine' })
         .expect(201)
       .export(module);
       