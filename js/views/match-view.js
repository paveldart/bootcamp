(function ($) {
    var app = window.app || {};

	// Match Item View
	// --------------

	app.MatchView = Backbone.View.extend({
		//... is a list tag.
		tagName:  'div',

		// Cache the template function for a single item.
		template: _.template($('#item-template').html()),

		// The DOM events specific to an item.
		events: {
			'click .match-item': 'toggleMatch',
			'click .match-view': 'toggleMatch',
			'click .match-info': 'toggleMatch',
			'click .match-hero-stats': 'toggleMatch',
			'click .hero-image': 'showPopup'
		},

		initialize: function (options) {
            var that = this,
                model = that.model,
                result = model.get('result'),
                currentTime = new Date().getTime() / 1000,
                heroes = app.heroes.toJSON()[0],
                players = result.players,
                playerID,
                player,
                cache,
                i,
                u;

            that.$el.addClass('match-view');

            for ( i = players.length ; i-- ; ) {
                playerID = players[i].account_id;
                if ((playerID === 83684200) || (playerID === 83161861)) {
                    result.radiant_team = i <= 4;
                }
            }

            if ((result.radiant_win === true && result.radiant_team === true) || (result.radiant_win === false && result.radiant_team === false)) {
                result.won_match = true;
                that.$el.addClass('won');
                model.set('win', true);
            } else {
                result.won_match = false;
                that.$el.addClass('lost');
                model.set('win', false);
            }

            if ((app.cache.currentTimestamp !== u) && (app.cache.currentTimestamp - result.start_time > 54000)) {
                that.$el.addClass('new-day');
            }

            app.cache.currentTimestamp = result.start_time - 0;

            cache = app.cache;

            for ( i = players.length ; i-- ; ) {
                player = players[i];

                if (((result.radiant_win === true) && (result.radiant_team === true) && (i <= 4)) || ((result.radiant_win === false) && (result.radiant_team === false) && (i > 4))) {
                    if (cache.ourWinHeroes['' + player.hero_id] === u) {
                        cache.ourWinHeroes['' + player.hero_id] = 1;
                        cache.ourWinHeroes.count += 1;
                    } else {
                        cache.ourWinHeroes['' + player.hero_id] += 1;
                    }

                    if (cache.ourHeroes['' + player.hero_id] === u) {
                        cache.ourHeroes['' + player.hero_id] = {
                            win: 1,
                            lose: 0,
                            kills: player.kills,
                            deaths: player.deaths,
                            assists: player.assists,
                            hero_damage: player.hero_damage
                        };
                        cache.ourHeroes.count += 1;
                    } else {
                        cache.ourHeroes['' + player.hero_id].win += 1;
                        cache.ourHeroes['' + player.hero_id].kills += player.kills;
                        cache.ourHeroes['' + player.hero_id].deaths += player.deaths;
                        cache.ourHeroes['' + player.hero_id].assists += player.assists;
                        cache.ourHeroes['' + player.hero_id].hero_damage += player.hero_damage;
                    }
                } else if (((result.radiant_win === false) && (result.radiant_team === true) && (i <= 4)) || ((result.radiant_win === true) && (result.radiant_team === false) && (i > 4))) {
                    if (cache.ourHeroes['' + player.hero_id] === u) {
                        cache.ourHeroes['' + player.hero_id] =  {
                            win: 0,
                            lose: 1,
                            kills: player.kills,
                            deaths: player.deaths,
                            assists: player.assists,
                            hero_damage: player.hero_damage
                        };
                        cache.ourHeroes.count += 1;
                    } else {
                        cache.ourHeroes['' + player.hero_id].lose += 1;
                        cache.ourHeroes['' + player.hero_id].kills += player.kills;
                        cache.ourHeroes['' + player.hero_id].deaths += player.deaths;
                        cache.ourHeroes['' + player.hero_id].assists += player.assists;
                        cache.ourHeroes['' + player.hero_id].hero_damage += player.hero_damage;
                    }
                }


                if (((result.radiant_win === true) && (result.radiant_team === false) && (i <= 4)) || ((result.radiant_win === false) && (result.radiant_team === true) && (i > 4))) {
                    if (cache.opponentsWinHeroes['' + player.hero_id] === u) {
                        cache.opponentsWinHeroes['' + player.hero_id] = 1;
                        cache.opponentsWinHeroes.count += 1;
                    } else {
                        cache.opponentsWinHeroes['' + player.hero_id] += 1;
                    }

                    if (cache.opponentsHeroes['' + player.hero_id] === u) {
                        cache.opponentsHeroes['' + player.hero_id] = {
                            win: 1,
                            lose: 0,
                            kills: player.kills,
                            deaths: player.deaths,
                            assists: player.assists,
                            hero_damage: player.hero_damage
                        };
                        cache.opponentsHeroes.count += 1;
                    } else {
                        cache.opponentsHeroes['' + player.hero_id].win += 1;
                        cache.opponentsHeroes['' + player.hero_id].kills += player.kills;
                        cache.opponentsHeroes['' + player.hero_id].deaths += player.deaths;
                        cache.opponentsHeroes['' + player.hero_id].assists += player.assists;
                        cache.opponentsHeroes['' + player.hero_id].hero_damage += player.hero_damage;
                    }
                } else if (((result.radiant_win === false) && (result.radiant_team === false) && (i <= 4)) || ((result.radiant_win === true) && (result.radiant_team === true) && (i > 4))) {
                    if (cache.opponentsHeroes['' + player.hero_id] === u) {
                        cache.opponentsHeroes['' + player.hero_id] = {
                            win: 0,
                            lose: 1,
                            kills: player.kills,
                            deaths: player.deaths,
                            assists: player.assists,
                            hero_damage: player.hero_damage
                        };
                        cache.opponentsHeroes.count += 1;
                    } else {
                        cache.opponentsHeroes['' + player.hero_id].lose += 1;
                        cache.opponentsHeroes['' + player.hero_id].kills += player.kills;
                        cache.opponentsHeroes['' + player.hero_id].deaths += player.deaths;
                        cache.opponentsHeroes['' + player.hero_id].assists += player.assists;
                        cache.opponentsHeroes['' + player.hero_id].hero_damage += player.hero_damage;
                    }
                }
            }

            that.wrapperPopup = options.wrapperPopup;

            result.duration_text = that.parsePeriod(currentTime - (result.start_time + result.duration));
            result.duration_parse = that.parseDuration(result.duration);
            result.mode_text = app.mods.toJSON()[0].mods[result.game_mode].name;

            model.set('result', result);
            model.set('heroes', heroes);

            that.listenTo(model, 'change', that.render);
            that.listenTo(model, 'destroy', that.remove);
//            that.listenTo(model, 'visible', that.toggleVisible);

		},

		render: function () {
            var that = this;

            that.$el.html(that.template(that.model.toJSON()));

//            that.$input = that.$('.edit');

			return that;
		},

		toggleMatch: function (e) {
            var that = this,
                $el = that.$el;

            if ($(e.target).hasClass('hero-image') !== true) {
                if ($el.hasClass('isToggled')) {
                    $el.removeClass('isToggled');
                } else {
                    $el.addClass('isToggled');
                }
            }
		},

//        toggleVisible: function () {
//			this.$el.toggleClass('hidden', this.isHidden());
//		},

		isHidden: function () {
			var isCompleted = this.model.get('completed');
			return (// hidden cases only
				(!isCompleted && app.MatchFilter === 'completed') ||
				(isCompleted && app.MatchFilter === 'active')
			);
		},

		// Toggle the `"completed"` state of the model.
		toggleCompleted: function () {
			this.model.toggle();
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function () {
			this.$el.addClass('editing');
//			this.$input.focus();
		},

		close: function () {
//			var value = this.$input.val();
			var trimmedValue = value.trim();

			if (trimmedValue) {
				this.model.save({ title: trimmedValue });

				if (value !== trimmedValue) {
					// Model values changes consisting of whitespaces only are not causing change to be triggered
					// Therefore we've to compare untrimmed version with a trimmed one to chech whether anything changed
					// And if yes, we've to trigger change event ourselves
					this.model.trigger('change');
				}
			} else {
				this.clear();
			}

			this.$el.removeClass('editing');
		},

		clear: function () {
			this.model.destroy();
		},

        getTextCase: function (number, v1, v2) {
            var lastCharInNumber,
                textForNumber;

            lastCharInNumber = ((number + '').slice(-1)) - 0;

            if (lastCharInNumber === 1) {
                textForNumber = v1;
            } else {
                textForNumber = v2;
            }

            return number + ' ' + textForNumber
        },

        parsePeriod: function(unix_timestamp){
            var that = this,
                time,
                number = unix_timestamp || null;

            if (unix_timestamp > 59) {
                if (unix_timestamp > 3599) {
                    if (unix_timestamp > 86399) {
                        // days
                        number = parseInt(unix_timestamp / 86400, 10);

                        time = that.getTextCase(number, 'day', 'days');
                    } else {
                        // hours
                        number = parseInt(unix_timestamp / 3600, 10);

                        time = that.getTextCase(number, 'hour', 'hour');
                    }
                } else {
                    // minutes
                    number = parseInt(unix_timestamp / 60, 10);

                    time = that.getTextCase(number, 'minute', 'minutes');
                }
            } else {
                // seconds
                number = unix_timestamp;

                time = that.getTextCase(number, 'second', 'seconds');
            }

            return time + ' ago';
        },

        parseDuration: function(duration){
            var minutes,
                seconds;

            minutes = (duration / 60) | 0;
            seconds = duration % 60;

            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            return minutes + ':' + seconds;
        },

        showPopup: function(e){
            var that = this,
                id = e.currentTarget.getAttribute('data-id');

            e.preventDefault();
            that.popup = new app.PopupView({ heroID: id, wrapperPopup: that.wrapperPopup });

            that.wrapperPopup.addClass('isVisible');
        }
	});
})(jQuery);
