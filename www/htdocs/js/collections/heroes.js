(function () {
    var app = window.app || {};

	// Mathes Collection
	// ---------------

	var Heroes = Backbone.Collection.extend({
        url: '/data/heroes.json'
	});

	app.heroes = new Heroes();
})();
