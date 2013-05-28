define(['async', 'mysql'], function(async, mysql) {

	var time = 0;
	var timer = function(action) {
		var d = Date.now();
		if (time < 1 || action === 'start') {
			time = d;
			return 0;
		} else if (action === 'stop') {
			var t = d - time;
			time = 0;
			return t;
		} else {
			return d - time;
		}
	};

	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : '',
	});
	connection.connect();

	connection.query('CREATE DATABASE benchmarks', function(err, rows, fields) {
		if (err) {
			console.log(err);
		} else {
			console.log('database creation OK');

		}
	});

	connection.query('USE benchmarks', function(err, rows, fields) {
		if (err) {
			console.log(err);
		} else {
			console.log('database selection OK');
		}
	});

	connection.query('CREATE TABLE game_engine(id INT NOT NULL, name char(50), description char(200), PRIMARY KEY (id))', function(err, rows, fields) {
		if (err) {
			console.log(err);
		} else {
			console.log('table selection OK');
		}
	});

	connection.query('CREATE TABLE badge(id INT NOT NULL, app_id INT NOT NULL, name char(50), description char(200), URLbadge char(200), points INT, PRIMARY KEY(id), FOREIGN KEY (app_id) REFERENCES game_engine (id))', function(err, rows, fields) {
		if (err) {
			console.log(err);
		} else {
			console.log('table selection OK');
		}
	});

	connection.query('CREATE TABLE level(id INT NOT NULL, app_id INT NOT NULL, name char(50), description char(200), points INT, PRIMARY KEY(id), FOREIGN KEY (app_id) REFERENCES game_engine (id))', function(err, rows, fields) {
		if (err) {
			console.log(err);
		} else {
			console.log('table selection OK');
		}
	});

	connection.query('CREATE TABLE user(id INT NOT NULL, app_id INT NOT NULL, PRIMARY KEY(id, app_id), FOREIGN KEY (app_id) REFERENCES game_engine (id))', function(err, rows, fields) {
		if (err) {
			console.log(err);
		} else {
			console.log('table selection OK');
		}
	});

	connection.query('CREATE TABLE user_badge(badge_id INT NOT NULL AUTO_INCREMENT, app_id INT NOT NULL, PRIMARY KEY(badge_id, app_id), FOREIGN KEY (app_id) REFERENCES game_engine (id), FOREIGN KEY (badge_id) REFERENCES badge (id))', function(err, rows, fields) {
		if (err) {
			console.log(err);
		} else {
			console.log('table selection OK');
		}
	});

	var tasks = new Array();
	var z = 0;
	var userid=0;
	tasks.push(function(callback) {
		timer('start');
		callback();
	})
	
	for (var i = 0; i < 10; i++) {
		tasks.push(function(callback) {
			insertGameEngine(z++, callback);
		});
		for (var j = 0; j < 100; j++) {
			tasks.push(function(callback) {
				insertUser(userid++, z - 1, callback);
			});
		}
		tasks.push(function(callback) {
			userid=0;
			callback();
		});
	}
	tasks.push(function(callback) {
		console.log(timer('stop'));
		timer('start');
		callback();
	});

	z = 0;
	for (var i = 0; i < 100; i++) {
		tasks.push(function(callback) {
			selectLevel(z++, callback);
		});
	}

	async.series(tasks, function(err) {
		console.log(timer('stop'));
		connection.end();
	});
	
	

	function insertGameEngine(id, callback) {
		connection.query('INSERT INTO game_engine (id, name, description) VALUES (' + id + ',' + id + ', "Game Application");', function(err, rows, fields) {
			if (err) {
				console.log(err);
				console.log(id);
			}
			callback();
		});
	}

	function insertUser(id, app_id, callback) {
		connection.query('INSERT INTO user (id, app_id) VALUES (' + id + ', ' + app_id + ');', function(err, rows, fields) {
			if (err) {
				console.log(err);
				console.log(id);
			}
			callback();
		});
	}

	function insertBadge(i, callback) {
		connection.query('INSERT INTO badge  (id, app_id) (' + i + ', "value2");', function(err, rows, fields) {
			if (err) {
				console.log(err);
			}
			callback();
		});
	}

	function selectLevel(i, callback) {
		connection.query('SELECT * FROM level WHERE name=' + i + ';', function(err, rows, fields) {
			if (err) {
				console.log(err);
			}
			callback();
		});
	}

	function selectUser(i, callback) {
		connection.query('SELECT * FROM user WHERE id=' + i + ';', function(err, rows, fields) {
			if (err) {
				console.log(err);
			}
			callback();
		});
	}

});

