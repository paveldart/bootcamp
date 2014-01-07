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
		el: '#bootcamp',

		// Our template for the line of statistics at the bottom of the app.
		statsTemplate: _.template($('#stats-template').html()),

		events: {
            'click #stats-container': 'visibleStats',
            'click body': 'visibleStatsBody'
		},

		initialize: function () {
            var that = this,
                $el = that.$el;

            that.allCheckbox = $el.find('#toggle-all')[0];
            that.$stats = $el.find('#stats-container');
            that.matchList = $el.find('#matches-list');
            that.$main = $el.find('#main');

            that.$popup = $('#popup-wrapper');

            that.renderCount = 0;
            that.$statsVisible = false;
            that.isFetched = false;

            that.listenTo(app.matches, 'add', that.addOne);
            that.listenTo(app.matches, 'reset', that.addAll);
            that.listenTo(app.heroes, 'reset', that.addAll);
            that.listenTo(app.mods, 'reset', that.addAll);
            that.listenTo(app.matches, 'filter', that.filterAll);
            that.listenTo(app.matches, 'all', that.render);

			// Suppresses 'add' events with {reset: true} and prevents the app view 
			// from being re-rendered for every model. Only renders when the 'reset'
			// event is triggered at the end of the fetch.
			app.mods.fetch({reset: true});
			app.heroes.fetch({reset: true});
			app.matches.fetch({reset: true});
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function () {
			var that = this,
                wins,
                loses,
                radiant,
                dire,
                radiantWins,
                radiantLoses,
                direWins,
                direLoses,
                ourWinHeroes,
                opponentsWinHeroes,
                cache = app.cache,
                u;


            if ((cache !== u) && (cache.isLoading === true)) {
                wins = app.matches.win().length;
                loses = app.matches.lose().length;
                radiant = app.matches.radiant().length;
                dire = app.matches.dire().length;
                radiantWins = app.matches.radiantWins().length;
                radiantLoses = radiant - radiantWins;
                direWins = app.matches.direWins().length;
                direLoses = dire - direWins;

                if (app.matches.length) {
//                    cache.ourWinRateHeroes = that.winRateSortHeroes(cache.ourHeroes);
//                    cache.opponentsWinRateHeroes = that.winRateSortHeroes(cache.opponentsHeroes);

                    ourWinHeroes = that.sortHeroes(cache.ourWinHeroes);
                    opponentsWinHeroes = that.sortHeroes(cache.opponentsWinHeroes);
                    ourWinHeroes = that.deleteUnnecessaryHeroes(ourWinHeroes, 'our');
                    opponentsWinHeroes = that.deleteUnnecessaryHeroes(opponentsWinHeroes, 'opponents');

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
                        direLoses: direLoses,
                        heroes: app.heroes.toJSON()[0],
                        ourWinHeroes: ourWinHeroes,
                        opponentsWinHeroes: opponentsWinHeroes
                    }));
                } else {
                    that.$main.hide();
                    that.$stats.hide();
                }
            }
		},

		addOne: function (match) {
            var that = this,
                view = new app.MatchView({ model: match, wrapperPopup: that.$popup });

            that.matchList.append(view.render().el);
		},

		addAll: function () {
            var that = this;

            that.matchList.html('');

            if ((that.isFetched === false) && (app.heroes.toJSON()[0] !== u) && (app.matches.toJSON()[0] !== u) && (app.mods.toJSON()[0] !== u)) {
                that.isFetched = true;
                app.matches.each(that.addOne, that);
                if (app.cache.isLoading === false) {
                    that.$el.addClass('isLoading');
                    app.cache.isLoading = true;
                }
            }
		},

		filterOne: function (match) {
            match.trigger('visible');
		},

		filterAll: function () {
            var that = this;

			app.matches.each(that.filterOne, that);
		},

        visibleStats: function (e) {
            var that = this;

            e.preventDefault();

            if (that.$statsVisible === true) {
                that.$stats.removeClass('isVisible');
                that.$statsVisible = false;
            } else {
                that.$stats.addClass('isVisible');
                that.$statsVisible = true;
            }
		},

        visibleStatsBody: function (e) {
            var that = this;

            e.preventDefault();

            if (that.$statsVisible === true) {
                that.$stats.removeClass('isVisible');
                that.$statsVisible = false;
            }
		},

        sortHeroes: function(heroes) {
            var sortHeroes = {},
                heroID,
                currentHero;

            for (heroID in heroes) {
                if ((heroes.hasOwnProperty(heroID)) && (heroID !== 'count')) {
                    currentHero = '' + heroes[heroID];
                    if (sortHeroes[currentHero] === u) {
                        sortHeroes[currentHero] = [];
                        sortHeroes[currentHero].push(heroID);
                    } else {
                        sortHeroes[currentHero].push(heroID)
                    }
                }
            }
            sortHeroes.count = heroes.count;
            return sortHeroes;
        },

        winRateSortHeroes: function(heroes) {
            var sortHeroes = {},
                heroID,
                currentHero,
                currentLoseValue,
                currentWinValue,
                currentValue;

            for (heroID in heroes) {
                if ((heroes.hasOwnProperty(heroID)) && (heroID !== 'count')) {
                    currentHero = heroes[heroID];
                    currentWinValue = currentHero.win;
                    currentLoseValue = currentHero.lose;

                    if (currentLoseValue === 0) {
                        currentValue = '100';
                    } else {
                        currentValue = Math.round(100 * currentWinValue / (currentWinValue + currentLoseValue)) + '';
                    }

                    if (sortHeroes[currentValue] === u) {
                        sortHeroes[currentValue] = [];
                        sortHeroes[currentValue].push(heroID);
                    } else {
                        sortHeroes[currentValue].push(heroID)
                    }
                }
            }
            return this.deleteUnnecessaryHeroes(sortHeroes, null);
        },

        deleteUnnecessaryHeroes: function(heroes, type) {
            var countID,
                winHeroes = [],
                currentHeroes,
                currentHeroesCount,
                cache = app.cache.ourHeroes,
                i;

            if (type === 'opponents') {
                cache = app.cache.opponentsHeroes;
            }

            for (countID in heroes) {
                if ((heroes.hasOwnProperty(countID)) && (countID !== 'count')) {
                    currentHeroesCount = heroes[countID];
                    for (i = currentHeroesCount.length; i--;) {
                        currentHeroes = [];
                        currentHeroes.push(currentHeroesCount[i]);
                        currentHeroes.push(countID);
                        winHeroes.push(currentHeroes);
                    }
                }
            }

            function pushLose(array) {
                if (cache[array[0]] === u) {
                    array.push('0');
                } else {
                    array.push(cache[array[0]].lose + '');
                }
            }

            winHeroes[0] = winHeroes[winHeroes.length - 1];
            winHeroes[1] = winHeroes[winHeroes.length - 2];
            winHeroes[2] = winHeroes[winHeroes.length - 3];
            winHeroes[3] = winHeroes[winHeroes.length - 4];
            winHeroes[4] = winHeroes[winHeroes.length - 5];

            winHeroes.length = 5;

            if (type !== null) {
                for (i = winHeroes.length; i-- ;) {
                    pushLose(winHeroes[i]);
                }
            }

            return winHeroes;
        }
    });
})(jQuery);
