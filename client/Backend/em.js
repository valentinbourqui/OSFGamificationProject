
var council = "No id";

$.ajax({
		dataType: "json",
		url: "http://localhost:3000/test",
		async : false,
		type: 'get',			
		success : function(data) {
			   council = data;
	    }
});	


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
