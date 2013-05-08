App = Ember.Application.create({LOG_TRANSITIONS: true});

App.Store = DS.Store.extend({
  revision: 12,
  adapter: DS.RESTAdapter.extend({
    url: 'data'
  })
});

App.Router.map(function() {
  this.resource('posts', function() {
    this.resource('post', { path: ':post_id' })
  });
  this.resource('about');
  this.resource('users', function() {
  	this.resource('user', { path: ':user_id' })
  });
});

// Redirige la page d'accueil vers "posts"
App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('posts');
  }
});


/*
 * Définition du modèle Post
 */

App.PostsRoute = Ember.Route.extend({
  model: function() {
    return App.Post.find();
  },
});

App.PostController = Ember.ObjectController.extend({
  isEditing: false,
  doneEditing: function() {
    this.set('isEditing', false);
    this.get('store').commit(); // !!! This isn't going to work because
                    //we arent using a real REST service in this example.
  },
  edit: function() {
    this.set('isEditing', true);
  },
});

App.Post = DS.Model.extend({
  title: DS.attr('string'),
  author: DS.belongsTo('App.User'),
  intro: DS.attr('string'),
  extended: DS.attr('string'),
  publishedAt: DS.attr('date'),
});

Ember.Handlebars.registerBoundHelper('date', function(date) {
  return moment(date).fromNow();
});

var showdown = new Showdown.converter();
Ember.Handlebars.registerBoundHelper('md', function(input) {
  return new Ember.Handlebars.SafeString(showdown.makeHtml(input));
});


/*
 * Définition du modèle User
 */
App.UsersRoute = Ember.Route.extend({
  model: function() {
    return App.User.find();
  },
});


App.User = DS.Model.extend({
	name: DS.attr('string'),
	posts: DS.hasMany('App.Post')
});

