function deleteGameEngine() {
	var ID = document.getElementById('gameIDDel').value
	$.ajax({
		type : "DELETE",
		url : 'http://127.0.0.10:3000/admin/game_engine/' + ID,
		contentType : 'application/json',
		success : function(game) {
			alert("Succes ! Game Engine deleted ! ");
			document.getElementById('gameEngineID').textContent = "-";
			document.getElementById('gameEngineName').textContent = "-";
			document.getElementById('gameIDDel').value = "ID Game Engine";
			for (var i = 0; i < 10; i++) {
				var id = 'badgeID' + i;
				var name = 'badgeName' + i;
				document.getElementById(id).textContent = "-";
				document.getElementById(name).innerHTML = "-";

			}
			for (var i = 0; i < 7; i++) {
				var id = 'levelID' + i;
				var name = 'levelName' + i;
				document.getElementById(id).textContent = "-";
				document.getElementById(name).innerHTML = "-";

			}
			for (var i = 0; i < 4; i++) {
				var id = 'eventPtsID' + i;
				var name = 'eventPtsName' + i;
				document.getElementById(id).textContent = "-";
				document.getElementById(name).innerHTML = "-";
				var id = 'eventBgeID' + i;
				var name = 'eventBgeName' + i;
				document.getElementById(id).textContent= "-";
				document.getElementById(name).innerHTML= "-";
			}

		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert("Error ID not valid ! ");
			alert(xhr.statusText);
			alert(thrownError);
		}
	});

}

function createGameEngine() {
	$.ajax({
		type : "POST",
		url : 'http://127.0.0.10:3000/admin/game_engine',
		contentType : 'application/json',
		dataType : "json",
		data : game,
		success : function(game) {
			document.getElementById('gameEngineID').textContent = game.id;
			document.getElementById('gameEngineName').textContent = game.name;
			createLevel(game.id, 0);
			createbadge(game.id, 0);
			createEventPoints(game.id, 0);
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(xhr.statusText);
			alert(thrownError);
		}
	});

};

function createbadge(gameID, i) {
	$.ajax({
		type : "POST",
		url : 'http://127.0.0.10:3000/admin/' + gameID + '/badge',
		contentType : 'application/json',
		dataType : "json",
		data : badge[i],
		success : function(badge) {
			var id = 'badgeID' + i;
			var name = 'badgeName' + i;

			document.getElementById(id).textContent = badge.id;
			document.getElementById(name).innerHTML = badge.name + " - " + badge.points + "pts - <img src=" + badge.URLBadge + " alt='badge1' height='20' width='20'> ";
			if (i < 9) {
				createbadge(gameID, (i + 1));
			}
			if (i == 0 || i == 1 || i == 2 || i == 9) {
				createEventbadge(gameID, i, badge.id)
			}
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(xhr.statusText);
			alert(thrownError);
		}
	});
};

function createLevel(gameID, i) {
	$.ajax({
		type : "POST",
		url : 'http://127.0.0.10:3000/admin/' + gameID + '/level',
		contentType : 'application/json',
		dataType : "json",
		data : level[i],
		success : function(level) {
			var id = 'levelID' + i;
			var name = 'levelName' + i;

			document.getElementById(id).textContent = level.id;
			document.getElementById(name).textContent = level.name + " - " + level.points + "pts";
			if (i < 6) {
				createLevel(gameID, (i + 1));
			}
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(xhr.statusText);
			alert(thrownError);
		}
	});

};

function createEventPoints(gameID, i) {
	$.ajax({
		type : "POST",
		url : 'http://127.0.0.10:3000/admin/' + gameID + '/event',
		contentType : 'application/json',
		dataType : "json",
		data : eventPoints[i],
		success : function(event) {
			var id = 'eventPtsID' + i;
			var name = 'eventPtsName' + i;

			document.getElementById(id).textContent = event.eventId;
			document.getElementById(name).innerHTML = event.name + " - " + event.value + "pts";
			if (i < 3) {
				createEventPoints(gameID, (i + 1));
			}
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(xhr.statusText);
			alert(thrownError);
		}
	});
}

function createEventbadge(gameID, i, badgeID) {
	var eventbadge;
	if (i == 0) {
		eventbadge = JSON.stringify({
			'name' : 'badge post',
			'description' : 'Frist post',
			'eventId' : 'badge1',
			'eventType' : 'badge',
			'value' : badgeID
		});
	} else if (i == 1) {
		eventbadge = JSON.stringify({
			'name' : 'badge edit',
			'description' : 'First edit post',
			"eventId" : 'badge2',
			'eventType' : 'badge',
			'value' : badgeID
		});
	} else if (i == 2) {
		eventbadge = JSON.stringify({
			'name' : 'badge delete',
			'description' : 'First delete post',
			'eventId' : 'badge3',
			'eventType' : 'badge',
			'value' : badgeID
		});
	} else {
		i = 3;
		eventbadge = JSON.stringify({
			'name' : 'badge master',
			'description' : 'Event badge',
			'eventId' : 'badge4',
			'eventType' : 'badge',
			'value' : badgeID
		});
	}
	$.ajax({
		type : "POST",
		url : 'http://127.0.0.10:3000/admin/' + gameID + '/event',
		contentType : 'application/json',
		dataType : "json",
		data : eventbadge,
		success : function(event) {
			var id = 'eventBgeID' + i;
			var name = 'eventBgeName' + i;
			document.getElementById(id).textContent = event.eventId;
			document.getElementById(name).innerHTML = event.name + " - " + event.value + " ID badge";
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(xhr.statusText);
			alert(thrownError);
		}
	});
}

