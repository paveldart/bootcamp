(function () {
    var app = window.app || {},
        AppRouter;

	// Router
	// ----------
    AppRouter = Backbone.Router.extend({
		routes: {
//			'*filter': 'setFilter',
            'draft': 'draftPage',
            '': 'mainPage',
            '/': 'mainPage'
		},

        mainPage: function () {
            new app.PageView();
        },

        draftPage: function () {
            new app.DraftView();
        }

//		setFilter: function (param) {
//			// Set the current filter to be used
//			app.MatchFilter = param || '';
//
//			// Trigger a collection filter event, causing hiding/unhiding
//			// of Match view items
//			app.matches.trigger('filter');
//		},
	});

	app.AppRouter = new AppRouter();
    app.AppRouter.on('route:defaultRoute', function(actions) {
        console.log(actions);
    });
})();
