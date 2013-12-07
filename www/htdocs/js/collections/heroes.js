(function () {
    var app = window.app || {},
        Heroes;

	// Heroes Collection
	// ---------------

	Heroes = Backbone.Collection.extend({
        url: '/data/heroes.json'
	});

	app.heroes = new Heroes();
})();
