App = Ember.Application.create({});

App.Store = DS.Store.extend({
  revision: 12,
  // adapter: 'DS.FixtureAdapter',
  adapter: DS.RESTAdapter.extend({
    url: 'data'
  })
});

App.Router.map(function() {
  this.resource('posts', function() {
    this.resource('post', { path: ':post_id' })
  });
  this.resource('about');
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('posts');
  }
});

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
  author: DS.attr('string'),
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
