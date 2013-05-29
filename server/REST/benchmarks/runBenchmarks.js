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
	var NB_RANDOM_SELECT = 1000;

	var dbs = [dbCouchDB, dbMySQL];

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

	if (process.argv.length == 2) {
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
			for (var j = 0; j < 10; j++) {
				tasks.push(function(callback) {
					dbs[dbnb].insertGameEngine(appid++, callback);
				});
				for (var k = 0; k < 600; k++) {
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
				console.log(dbs[dbnb].getName() + " : Select randomly " + NB_RANDOM_SELECT + " users");
				timer('start');
				callback();
			});

			for (var j = 0; j < NB_RANDOM_SELECT; j++) {
				if (dbs[i] == dbCouchDB && j == 0) {
					tasks.push(function(callback) {
						timer('start');
						callback();
					});
				}
				tasks.push(function(callback) {
					dbs[dbnb].selectUsersByAppid(getRandomNumber(0, NB_APPLICATIONS), getRandomNumber(0, NB_USERS_PER_APPLICATION), callback);
				});
				if (dbs[i] == dbCouchDB && j == 0) {
					tasks.push(function(callback) {
						console.log("first view call :" + timer('stop'));
						timer('start');
						callback();
					});
				}
			}

			tasks.push(function(callback) {
				console.log(timer('stop'));
				dbs[dbnb].close(callback);
			});

			tasks.push(function(callback) {
				appid = 0;
				dbnb++;
				callback();
			});
		}
	} else if (process.argv[2] == "insert") {
		var z = 1000;
		var app_id = 0;
		var app = 0;
		for (var i = 0; i < dbs.length; i++) {
			tasks.push(function(callback) {
				dbs[dbnb].createBase(callback);
			});
			for (var k = 0; k < 100; k++) {
				tasks.push(function(callback) {
					dbs[dbnb].insertGameEngine(app_id++, callback);
				});
			}
			for (var j = 1000; j < 100000; j += 1000) {
				tasks.push(function(callback) {
					app_id = 0;
					//console.log(dbs[dbnb].getName() + " : Insert " + z + " applications / " + NB_USERS_PER_APPLICATION + " users per application");
					timer('start');
					callback();
				});
				tasks.push(function(callback) {
					dbs[dbnb].insertUsers(z, app++, callback);
				});

				tasks.push(function(callback) {
					console.log(timer('stop'));
					z += 1000;
					require('sleep').sleep(1);
					callback();
				});
				tasks.push(function(callback) {
					dbs[dbnb].deleteUsers(callback);
				});

			}
		}
	} else if (process.argv[2] == "select") {
		for (var i = 0; i <= 1; i++) {
			var app_id = 0;
			var app = 0;

			tasks.push(function(callback) {
				dbs[dbnb].createBase(callback);
			});
			for (var k = 0; k < 10; k++) {
				tasks.push(function(callback) {
					dbs[dbnb].insertGameEngine(app_id++, callback);
				});
			}
			for (var j = 0; j < 10; j++) {
				tasks.push(function(callback) {
					dbs[dbnb].insertUsers(100, app++, callback);
				});
			}
			tasks.push(function(callback) {
				console.log(dbs[dbnb].getName());
				console.log("view : first access");
				timer('start');
				callback();
			});
			tasks.push(function(callback) {
				dbs[dbnb].selectUsersByAppid(getRandomNumber(0, 10), getRandomNumber(0, 10), callback);
			});
			tasks.push(function(callback) {
				console.log(timer('stop'));
				callback();
			});
			tasks.push(function(callback) {
				timer('start');
				callback();
			});
			for (var j = 0; j < 1000; j++) {
				tasks.push(function(callback) {
					dbs[dbnb].selectUsersByAppid(getRandomNumber(0, 10), getRandomNumber(0, 10), callback);
				});
			}
			tasks.push(function(callback) {
				console.log(timer('stop'));
				dbs[dbnb++].close(callback);
			});
		}
	} else if (process.argv[2] == "onedoc") {
		var app_id = 0;
		var id = 0;
		tasks.push(function(callback) {
			dbCouchDB.createBase(callback);
		});
		tasks.push(function(callback) {
			timer('start');
			callback();
		});
		tasks.push(function(callback) {
			dbCouchDB.insertUsersInOneDocument(19000, callback);
		});
		tasks.push(function(callback) {
			console.log(timer('stop'));
			console.log("view : first access");
			timer('start');
			callback();
		});
		tasks.push(function(callback) {
			dbCouchDB.selectUsersFromOneDocument(getRandomNumber(0, 10), getRandomNumber(0, 10), callback);
		});
		tasks.push(function(callback) {
			console.log(timer('stop'));
			callback();
		});
		tasks.push(function(callback) {
			timer('start');
			callback();
		});
		for (var j = 0; j < 1000; j++) {
			tasks.push(function(callback) {
				dbCouchDB.selectUsersFromOneDocument(getRandomNumber(0, 10), getRandomNumber(0, 10), callback);
			});
		}
		tasks.push(function(callback) {
			console.log(timer('stop'));
			dbCouchDB.close(callback);
		});
	}
	async.series(tasks);

});

