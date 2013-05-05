function deleteGameEngine(gameID) {
   
   var idLevel =0;
      
    // votre code à mesurer ici  
      
	$.ajax({
		type : "DELETE",
		url : 'http://127.0.0.10:3000/admin/game_engine/' + gameID,
		contentType : 'application/json',
		success : function(game) {
			alert("Succes ! tests finish ! ");
			document.getElementById('gameEngineID').textContent = "-";
			document.getElementById('gameEngineName').textContent = "-";
			document.getElementById('gameIDDel').value = "ID Game Engine";
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
		    var startTime = new Date().getTime(); 
			createLevel(game.id, 0,startTime);
		
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(xhr.statusText);
			alert(thrownError);
		}
	});

};


function createLevel(gameID, i,startTime) {
	$.ajax({
		type : "POST",
		url : 'http://127.0.0.10:3000/admin/' + gameID + '/level',
		contentType : 'application/json',
		dataType : "json",
		data : level[0],
		success : function(level) {
			if (i == 10 || i==110 || i== 1010) {
				idLevel	= level.id;
			}
			if (i == 100) {
				//createLevel(gameID, (i + 1));
				elapsedTime = new Date().getTime() - startTime;  
				document.getElementById("results").innerHTML +="<p id='times'>Create : "+convertTime(elapsedTime)+"</p>";
				getLevel(gameID, i,startTime,idLevel)
			
			}
			else if (i == 1000) {
				//createLevel(gameID, (i + 1));
				elapsedTime = new Date().getTime() - startTime;  
				document.getElementById("times").innerHTML +=" "+convertTime(elapsedTime);
				getLevel(gameID, i,startTime,idLevel)
			}
			else if (i == 10000) {
				//createLevel(gameID, (i + 1));
				elapsedTime = new Date().getTime() - startTime;  
				document.getElementById("times").innerHTML +=" "+convertTime(elapsedTime);
				getLevel(gameID, i,startTime,idLevel)
			}
			else{
				createLevel(gameID, (i + 1),startTime);
			}
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(xhr.statusText);
			alert(thrownError);
		}
	});

};


function getLevel(gameID, i,startTime,idLevel) {
	var startTimeLevel = new Date().getTime(); 
	$.ajax({
		type : "GET",
		url : 'http://127.0.0.10:3000/admin/' + gameID + '/level/'+idLevel,
		dataType : "json",
		success : function(level) {
				//createLevel(gameID, (i + 1));
				elapsedTime = new Date().getTime() - startTimeLevel;  
				document.getElementById("results").innerHTML +="<p id='getLevels'>get Level"+i+" : "+convertTime(elapsedTime)+"</p>";
			if(i<10000){
				createLevel(gameID, (i + 1),startTime);
			}
			else{
				deleteGameEngine(gameID);
			}
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(xhr.statusText);
			alert(thrownError);
		}
	});

};

function convertTime(time){
	
	if(time > 1000){
		return (time/1000)+"[S]";
	}
	else{
		return time+"[MS]";
	}
}


