(function () {
    var app = window.app || {},
        Mods;

	// Mods Collection
	// ---------------

	Mods = Backbone.Collection.extend({
        url: '/data/mods.json'
	});

	app.mods = new Mods();
})();
