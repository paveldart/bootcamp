/*global Backbone, jQuery, _ */
(function ($) {
    var app = window.app || {},
        u;

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#bootcamp-app',

		// Our template for the line of statistics at the bottom of the app.
		statsTemplate: _.template($('#stats-template').html()),

		events: {
		},

		initialize: function () {
            var that = this;

            that.allCheckbox = that.$('#toggle-all')[0];
            that.$stats = that.$('#stats-container');
            that.matchList = that.$('#matches-list');
            that.$main = that.$('#main');

            that.isFetched = false;

            that.listenTo(app.matches, 'add', that.addOne);
            that.listenTo(app.matches, 'reset', that.addAll);
            that.listenTo(app.heroes, 'reset', that.addAll);
            that.listenTo(app.matches, 'filter', that.filterAll);
            that.listenTo(app.matches, 'all', that.render);

			// Suppresses 'add' events with {reset: true} and prevents the app view 
			// from being re-rendered for every model. Only renders when the 'reset'
			// event is triggered at the end of the fetch.
			app.heroes.fetch({reset: true});
			app.matches.fetch({reset: true});
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function () {
			var that = this,
                wins = app.matches.win().length,
                loses = app.matches.lose().length,
                radiant = app.matches.radiant().length,
                dire = app.matches.dire().length,
                radiantWins = app.matches.radiantWins().length,
                radiantLoses = radiant - radiantWins,
                direWins = app.matches.direWins().length,
                direLoses = dire - direWins;

			if (app.matches.length) {
                that.$main.show();
                that.$stats.show();

                that.$stats.html(that.statsTemplate({
                    loses: loses,
                    wins: wins,
                    radiant: radiant,
                    dire: dire,
                    radiantWins: radiantWins,
                    radiantLoses: radiantLoses,
                    direWins: direWins,
                    direLoses: direLoses
				}));

                that.$('#filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (app.MatchFilter || '') + '"]')
					.addClass('selected');
			} else {
                that.$main.hide();
                that.$stats.hide();
			}

//            that.allCheckbox.checked = !remaining;
		},

		addOne: function (match) {
            var that = this,
                view = new app.MatchView({ model: match });

            that.matchList.append(view.render().el);
		},

		addAll: function () {
            var that = this;

            that.matchList.html('');

            if ((that.isFetched === false) && (app.heroes.toJSON()[0] !== u) && (app.matches.toJSON()[0] !== u)) {
                that.isFetched = true;
                app.matches.each(that.addOne, that);
            }
		},

		filterOne: function (match) {
            match.trigger('visible');
		},

		filterAll: function () {
            var that = this;

			app.matches.each(that.filterOne, that);
		}
	});
})(jQuery);
