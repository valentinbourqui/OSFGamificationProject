App = Ember.Application.create();

App.Store = DS.Store.extend({
	revision : 12,
	adapter : DS.RESTAdapter.extend({
		url : 'data'
	})
});

DS.RESTAdapter.configure("plurals", {
	user : "user"
});
DS.RESTAdapter.map('App.User', {
  level: {embedded: 'true'},
  badges: {embedded: 'true'},
  user: {embedded: 'load'},  
});

App.Store.registerAdapter('App.User', DS.RESTAdapter.extend({
	url : "http://127.0.0.10:3000/app/e871eaf3f76cfca29ca8e2d94d0008a6",
	mappings : {
		user : App.User
	}
}));

App.Router.map(function() {
	this.resource('persons', function() {
		this.resource('person', {
			path : ':person_id'
		})
	});
	this.resource('posts', function() {
		this.resource('post', {
			path : ':post_id'
		})
	});
	this.resource('about');

});

// Redirige la page d'accueil vers "posts"
App.IndexRoute = Ember.Route.extend({
	redirect : function() {
		this.transitionTo('persons');
		//Charger les informations de "persons"
		this.transitionTo('posts');
		//Redirige la page vers posts
	}
});

/*****************************
 * Définition du modèle Post
 ******************************/

App.PostsRoute = Ember.Route.extend({
	model : function() {
		return App.Post.find();
	}
});

App.NewPostController = Ember.Object.create({

	isPosting: false,
	createPost: function() {
		this.set('isPosting', true);
	},
	donePosting: function(){
		this.set('isPosting', false);
		post = App.Post.createRecord({});
		// Envoyer event à l'utilisateur loggé
	}
});

App.PersonCreateView = Ember.View.extend({ templateName: 'person_create' });

App.PostController = Ember.ObjectController.extend({
	isEditing: false,
	doneEditing: function() {
		this.set('isEditing', false);
		//this.get('store').commit();
	},
	edit: function() {
		this.set('isEditing', true);
	},
});

App.Post = DS.Model.extend({
	title : DS.attr('string'),
	author : DS.belongsTo('App.Person'),
	intro : DS.attr('string'),
	extended : DS.attr('string'),
	publishedAt : DS.attr('date')
});

Ember.Handlebars.registerBoundHelper('date', function(date) {
	return moment(date).fromNow();
});



var showdown = new Showdown.converter();
Ember.Handlebars.registerBoundHelper('md', function(input) {
	return new Ember.Handlebars.SafeString(showdown.makeHtml(input));
});

/*******************************
 * Définition du modèle Person *
 *******************************/
App.PersonsRoute = Ember.Route.extend({
	model : function() {
		return App.Person.find();
	},
	loggedUser: function(){
		return App.Person.find({ name: App.loginController.userName });
	}
});


App.Person = DS.Model.extend({
	name: DS.attr('string'),
	posts: DS.hasMany('App.Post'),
	user: DS.belongsTo('App.User')
});


/******************************
 * Définition du modèle User
 ******************************/
App.UserRoute = Ember.Route.extend({
	model : function(params) {
		return App.User.find(params.user_id);
	}
});

App.UserController = Ember.ObjectController.extend({
	isNotLogged : true,
	createUser : function() {
		this.set('isNotLogged', false);
	},
});

App.User = DS.Model.extend({
	points : DS.attr('number'),
    level : DS.belongsTo('App.Level'),
    badges : DS.hasMany('App.Badge')
	
});


/******************************
 * Définition du modèle Badge *
 ******************************/


App.Badge = DS.Model.extend({
	name : DS.attr('string'),
	description : DS.attr('string'),
	urlimg :  DS.attr('string'),
	points : DS.attr('number')
});

/******************************
 * Définition du modèle Level *
 ******************************/

App.Level = DS.Model.extend({
	name : DS.attr('string'),
	description : DS.attr('string'),
	points : DS.attr('number')
}); 

/******************************
 * Définition du modèle Event *
 ******************************/

App.LOGGEDUSER ;

App.loginController = Ember.Object.create({
  	userName: '',
  	isError: false,
  	isAuthenticated: false,
  	
	authenticate: function() {
		App.LOGGEDUSER = App.Person.loggedUser();
		var idLoggedUser = App.LOGGEDUSER.get('user_id');
	    // Normally this would go to the server. Simulate that.
	    if(App.LOGGEDUSER.get('name') === this.get('userName')) {
	      this.set('isError', false);
	      this.set('username', '');
	      this.set('isAuthenticated', true);
	    } else {
	      this.set('isError', true);
	    }
  },
  
  logOut: function(){
  	this.set('isAuthenticated', false);
  },
});
