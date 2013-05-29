define(['mysql'], function(mysql) {

	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : '',
	});

	createBase = function(callback) {

		connection.connect();
		connection.query('DROP DATABASE benchmarks', function(err, rows, fields) {

		});
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

		connection.query('CREATE TABLE user(id INT NOT NULL, app_id INT NOT NULL, PRIMARY KEY(id, app_id),  FOREIGN KEY (app_id) REFERENCES game_engine (id))', function(err, rows, fields) {
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
				callback();
			}
		});
	}
	insertBadges = function(id, app_id, callback) {
		connection.query('INSERT INTO badge (id, app_id) VALUES (' + id + ',' + app_id + ');', function(err, rows, fields) {
			if (err) {
				console.log(err);
			}
			callback();
		});
	}
	insertGameEngine = function(id, callback) {
		connection.query('INSERT INTO game_engine (id, name, description) VALUES (' + id + ',' + id + ', "Game Application");', function(err, rows, fields) {
			if (err) {
				console.log(err);
				console.log(id);
			}
			callback();
		});
	}
	insertUser = function(id, app_id, callback) {
		connection.query('INSERT INTO user (id, app_id) VALUES (' + id + ', ' + app_id + ');', function(err, rows, fields) {
			if (err) {
				console.log(id);
				console.log(err);
			}
			callback();
		});
	}
	selectUsersByAppid = function(app_id, id, callback) {
		connection.query('SELECT * FROM user WHERE id=' + id + ' and app_id=' + (app_id+10) + ';', function(err, rows, fields) {
			callback();
		});
	}
	begin = function(callback) {
		connection.query('START TRANSACTION;', function(err) {
			if (err) {
				console.log(err);
			} else {
				callback();
			}
		});
	}
	commit = function(callback) {
		connection.query('COMMIT;', function(err) {
			if (err) {
				console.log(i);
				console.log(err);
			} else {
				callback();
			}
		});
	}
	close = function(callback) {
		connection.end();
		callback();
	}
	getName = function() {
		return "mySQL";
	}
	deleteUsers = function(callback){
		connection.query("DELETE FROM user", function(err, rows, fields) {
			if (err) {
				console.log(id);
				console.log(err);
			}
			callback();
		});
	}
	insertUsers = function(iter,app_id,callback) {
		var string = 'INSERT INTO user (id, app_id) VALUES ';
		for (var id = 0; id < iter; id++) {
			string += '(' + id + ', ' + app_id + ')';
			if(id==iter-1)
				string+=';';
			else
				string+=',';
		}
		connection.query(string, function(err, rows, fields) {
			if (err) {
				console.log(id);
				console.log(err);
			}
			callback();
		});
	}

	return {
		deleteUsers : deleteUsers,
		insertUsers : insertUsers,
		selectUsersByAppid : selectUsersByAppid,
		getName : getName,
		begin : begin,
		commit : commit,
		createBase : createBase,
		insertBadges : insertBadges,
		insertGameEngine : insertGameEngine,
		insertUser : insertUser,
		close : close
	}

});
