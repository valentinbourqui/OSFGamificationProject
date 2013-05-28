var requirejs = require('requirejs');
requirejs.config({
	baseUrl : __dirname,
	//Pass the top-level main.js/index.js require
	//function to requirejs so that node modules
	//are loaded relative to the top-level JS file.
	nodeRequire : require
});

requirejs(['async', 'CouchDB/request', 'mySQL/request'], function(async, dbCouchDB, dbMySQL) {
	var NB_APPLICATIONS = 10;
	var NB_USERS_PER_APPLICATION = 100;

	var dbs = [dbMySQL, dbCouchDB];

	var tasks = new Array();
	var dbnb = 0;
	var appid = 0;
	var userid = 0;
	var time = 0;
	var timer = function(action) {
		var d = Date.now();
		if (time < 1 || action === 'start') {
			time = d;
			return 0;
		} else if (action === 'stop') {
			var t = d - time;
			time = 0;
			return t + "[ms]";
		} else {
			return d - time;
		}
	};

	function getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	for (var i = 0; i < dbs.length; i++) {
		tasks.push(function(callback) {
			dbs[dbnb].createBase(callback);
		})
		tasks.push(function(callback) {
			console.log(dbs[dbnb].getName() + " : Insert " + NB_APPLICATIONS + " applications / " + NB_USERS_PER_APPLICATION + " users per application");
			timer('start');
			callback();
		})
		if (dbs[i] == dbMySQL) {
			tasks.push(function(callback) {
				dbs[dbnb].begin(callback);
			});
		}
		for (var j = 0; j < NB_APPLICATIONS; j++) {
			tasks.push(function(callback) {
				dbs[dbnb].insertGameEngine(appid++, callback);
			});
			for (var k = 0; k < NB_USERS_PER_APPLICATION; k++) {
				tasks.push(function(callback) {
					dbs[dbnb].insertUser(userid++, appid - 1, callback);
				});
			}
			tasks.push(function(callback) {
				userid = 0;
				callback();
			});
		}
		if (dbs[i] == dbMySQL) {
			tasks.push(function(callback) {
				dbs[dbnb].commit(callback);
			});
		}

		tasks.push(function(callback) {
			console.log(timer('stop'));
			console.log(dbs[dbnb].getName() + " : Select randomly " + NB_USERS_PER_APPLICATION * 10 + " users");
			timer('start');
			callback();
		});

		for (var j = 0; j < NB_USERS_PER_APPLICATION * 10; j++) {
			tasks.push(function(callback) {
				dbs[dbnb].selectUsersByAppid(getRandomNumber(0, NB_APPLICATIONS), getRandomNumber(0, NB_USERS_PER_APPLICATION), callback);
			});
		}

		tasks.push(function(callback) {
			console.log(timer('stop'));
			dbs[dbnb].close(callback);
		});

		tasks.push(function(callback) {
			appid=0;
			dbnb++;
			callback();
		});
	}
	async.series(tasks);

});

