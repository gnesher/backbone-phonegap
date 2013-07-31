ContactsCollection = Backbone.Collection.extend({

})

ContactCellView = Backbone.View.extend({
	tagName: 'div',

	initialize: function() {
		this.render();
	},

	render: function() {
		this.$el.html('<a href="#contact/' + this.model.id + '">' + this.model.get("name").formatted + '</a>');
		$("#body").append(this.$el);
	}
})

SingleContactView = Backbone.View.extend({
	
	el: "#body",

	initialize: function() {
		this.template = _.template($("#singleView").html());	
	}, 

	render: function() {
		this.$el.html(this.template(this.model.attributes));
	}
})

SearchView = Backbone.View.extend({
	el: "#searchView",

	initialize: function() {
		$("#body").empty();
		this.options = new ContactFindOptions();
	},

	events: {
		'submit': 'search' 
	},

	search: function(e) {
		e.preventDefault();   
        this.options.filter = $("#searchinput").val();        
        var fields = ["displayName", "name", "phoneNumbers", "emails"];
        navigator.contacts.find(fields, this.onSuccess, this.onError, this.options);
        
	},
	
	onSuccess: function(contacts) {
		$("#body").empty();
        if (contacts.length == 0)
        	$("#body").html('No Contacts were found');
        else {
			ContactsApp.contactsCollection.reset(contacts);
        	ContactsApp.contactsCollection.each(function(contact) {
        		console.log (contact);
        		var contactCellView = new ContactCellView({model: contact});
        	});
        }
	},

	onError: function(data) {
		alert ('error');
	}
})

BackboneApp = Backbone.Router.extend({

	routes: {
		"": 'allContacts',
		"contact/:id": 'singleContact'
	},

	initialize: function() {
	},

	allContacts: function() {
		var searchView = new SearchView();
		this.contactsCollection = new ContactsCollection();
		// this.resultsView = new resultsView();
	},

	singleContact: function(id) {
		this.singleContactView = new SingleContactView({model: ContactsApp.contactsCollection.get(id)}).render();		
	}
})