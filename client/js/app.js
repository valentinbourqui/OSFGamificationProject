App = Ember.Application.create();

App.Store = DS.Store.extend({
 revision: 12,
	adapter : DS.ElasticSearchAdapter.create({url: 'http://localhost:9200'})
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
	url : "http://127.0.0.10:3000/app/59786afa85b1c5b7257db51b7b08f0fa",
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
		}),
		this.route('index')
	});
	this.resource('about');
    this.resource("badge");
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


App.Post = DS.Model.extend({
	title : DS.attr('string'),
	author : DS.belongsTo('App.Person'),
	intro : DS.attr('string'),
	extended : DS.attr('string'),
	publishedat : DS.attr('date')
});


App.PostsRoute = Ember.Route.extend({
	model : function() {
		return App.Post.find();
	},
});


App.PostsController = Ember.ObjectController.extend({
	isEditing : false,
  removeTask: function(post) {
    if ( confirm("Delete this task?") ) {
        post.deleteRecord();
        post.store.commit();
        var per = App.Person.find("11");
	    var url =  "http://127.0.0.10:3000/app/59786afa85b1c5b7257db51b7b08f0fa/user/"+per.get("user").get("id")+"/event";
	        $.post(url, { eventId: "TenComment"}).done(function(data) {
	        	 $.post(url, { eventId: "badge3"}).done(); 
		}); 
		
    }
  },
	loadedData : function() {
		App.Post.find();
	    App.Person.find();
	},
	
	createPost: function() {
	    
  var post,
      _this = this;
    post = App.Post.createRecord({});
    post.one('didCreate', function() {
      return Ember.run.next(_this, function() {
        return this.transitionTo("edit", post);
      });
    });
  //  return post.get("store").commit();
	   
   }
});
App.PostsIndexController = Ember.ObjectController.extend({
	doneEditing : function() {
		var ladate=new Date();
	     post = App.Post.createRecord({});
	    var per = App.Person.find("11");
	    var url =  "http://127.0.0.10:3000/app/59786afa85b1c5b7257db51b7b08f0fa/user/"+per.get("user").get("id")+"/event";
	        $.post(url, { eventId: "TenComment"}).done(function(data) {
	        	 $.post(url, { eventId: "badge1"}).done(); 
		}); 
		       
				post.set('publishedat', ""+ladate.getFullYear()+"-"+ladate.getDate()+"-"+(ladate.getMonth()+1));
		        post.set("title",this.get("title"));
		        post.set("intro",this.get("intro"));
		        post.set("extended",this.get("extended"));
		    //    post.set("author",per);
				this.set("title","");
				this.set("intro","");
				this.set("extended","");
				post.get("store").commit();	
	},
	title : "",
	intro : "",
	extended : "",
});
App.PostController = Ember.ObjectController.extend({
	isEditing : false,
	doneEditing : function() {
	    var per = App.Person.find("11");
	    var url =  "http://127.0.0.10:3000/app/59786afa85b1c5b7257db51b7b08f0fa/user/"+per.get("user").get("id")+"/event";
	        $.post(url, { eventId: "TenComment"}).done(function(data) {
	        	 $.post(url, { eventId: "badge2"}).done(); 
		}); 
		var ladate=new Date();
		this.set('isEditing', false);
		this.set('publishedat', ""+ladate.getFullYear()+"-"+ladate.getDate()+"-"+(ladate.getMonth()+1));
		this.get('store').commit();
	},
	edit : function() {
		
		this.set('isEditing', true);
	}
});
App.Post.reopenClass({
  url: 'osf/posts'
});



Ember.Handlebars.registerBoundHelper('date', function(date) {
	if(date != null)
		return moment(date).fromNow();
		else
		return "";
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
	//this.reload();
return App.Person.find();
}
});


App.Person = DS.Model.extend({
	name : DS.attr('string'),
	posts : DS.hasMany('App.Post'),
	user : DS.belongsTo('App.User'),

});


App.Person.reopenClass({
  url: 'osf/persons'
});

App.PersonController = Ember.ObjectController.extend({
	isNotLogged : true,
	setupController : function(){
		controller.set("content", App.Person.findAll());
		this.set('isNotLogged', false);
	},

    

});


/******************************
 * Définition du modèle User
 ******************************/
App.UserRoute = Ember.Route.extend({
	model : function() {
		return App.User.find();
	},
	model : function(id) {
		return App.User.find(id);
	},
	setupController: function(controller, user) {
   		 controller.set('model', user);
    }
});

App.UserController = Ember.ObjectController.extend({
	 setupController : function(controller){
        controller.set("content", App.User.findAll());
    }
});




App.User = DS.Model.extend({
	points : DS.attr('number'),
    level : DS.belongsTo('App.Level'),
    badges : DS.hasMany('App.Badge')
	
});
App.User.reopenClass({
  url: 'user'
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


App.PersonCreateView = Ember.View.extend({ templateName: 'person_create' }); 

/******************************
+ * Définition du modèle Event *
+ ******************************/

App.LOGGEDUSER = null ;

App.loginController = Ember.Object.create({
    userName: '',
    isError: false,
    isAuthenticated: false,
    
  authenticate: function() {
   

	var url =  "http://localhost:9200/osf/persons/_search?q=name:"+App.loginController.userName+"&pretty=true";
	  $.get(url).done(function(data) {
	  
	  	 App.LOGGEDUSER = data.hits.total;
	  	     // Normally this would go to the server. Simulate that.
	      if(App.LOGGEDUSER> 0) {
	        App.loginController.set('isError', false);
	        App.loginController.set('username', '');
	        App.loginController.set('isAuthenticated', true);
	      } else {
	        App.loginController.set('isError', true);
	         App.loginController.set('username', '');
	      }
		}); 
  },
  
  logOut: function(){
    this.set('isAuthenticated', false);
     this.set('username', '');
  },
}); 