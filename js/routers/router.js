(function () {
    var app = window.app || {},
        MatchRouter;

	// Match Router
	// ----------
    MatchRouter = Backbone.Router.extend({
		routes: {
			'*filter': 'setFilter'
		},

		setFilter: function (param) {
			// Set the current filter to be used
			app.MatchFilter = param || '';

			// Trigger a collection filter event, causing hiding/unhiding
			// of Match view items
			app.matches.trigger('filter');
		}
	});

	app.MatchRouter = new MatchRouter();
	Backbone.history.start();
})();
