
	var council;
var jqxhr = $.getJSON("http://127.0.0.1:8019/test", function() {
  alert("success");
})
.success(function() { alert("second success"); })
.error(function() { alert("error"); })
.complete(function() { alert("complete"); });
 
// perform other work here ...
 
// Set another completion function for the request above
jqxhr.complete(function(){ alert("second complete"); });	


Songs = Ember.Application.create({
    mixmaster: council,
    totalReviews: 0,
    ready: function(){
    	
      
       alert(council);
    }
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
