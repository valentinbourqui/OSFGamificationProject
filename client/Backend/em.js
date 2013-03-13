

var id = "user";


 Songs = Ember.Application.create({
   		mixmaster: id,
    	totalReviews: 0,
	});


Songs.Song = Ember.Object.extend({
    title: null,
    artist: null,
    genre: null,
    listens: 0
});
 
 
Songs.songsController = Ember.ArrayController.create({
    content: [],
    init: function(){
        // create an instance of the Song model
        var song = Songs.Song.create({
            title: 'Son of the Morning',
            artist: 'Oh, Sleeper',
            genre: 'Screamo'
        });
        this.pushObject(song);
    }
});

var callAPI = function (params) {
    var url = (typeof(params) === 'string' ? params : params.url),
        data = params.data || {},
        type = params.type || params.method || 'GET',
        call;
  if (type === 'GET') {
    myData = $.param({});
	call = $.getJSON(url, myData);
  }
  else if (type=='POST') {
   $.post(url, data, function(data, textStatus) {
	 alert(JSON.stringify(data)+"\n \n POST request OK ");
	
	
}, "json");
  }
  call
  .success(function (res) {
    $('#content').append("GET call result " + JSON.stringify(res) + '<br/>');
  })
  .error(function (err) {
    console.log(err);
  });
};


// Call API with GET
callAPI('http://127.0.0.10:3000/test');

// Call API with PUT
callAPI({
  url: 'http://127.0.0.10:3000/login',
  method: 'POST',
  data: {
    user: 'valentin',
    pass: 'testpass'
  }
});






/*$.ajax({
      url: 'http://127.0.0.10:3000/test',
       type: 'get',
      contentType: 'application/json',
      dataType: 'json',
      success: function (data) {
          alert(data);
          }
     
    });*/
    



