
Songs = Ember.Application.create({
    mixmaster: 'Andy',
    totalReviews: 0,
    ready: function(){
        alert('Ember sings helloooooooooo!');
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
