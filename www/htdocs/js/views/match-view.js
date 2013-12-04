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
//			'click .toggle': 'toggleCompleted',
//			'dblclick label': 'edit',
//			'click .destroy': 'clear',
//			'keypress .edit': 'updateOnEnter',
//			'blur .edit': 'close'
		},

		initialize: function () {
            var that = this,
                model = that.model,
                result = model.get('result'),
                currentTime = new Date().getTime() / 1000,
                heroes = app.heroes.toJSON()[0];

            if ((result.radiant_win === true && result.radiant_team === true) || (result.radiant_win === false && result.radiant_team === false)) {
                result.won_match = true;
                model.set('win', true);
            } else {
                result.won_match = false;
                model.set('win', false);
            }

            result.duration_text = that.parsePeriod(currentTime - result.start_time);

            model.set('result', result);
            model.set('heroes', heroes);

            that.listenTo(model, 'change', that.render);
            that.listenTo(model, 'destroy', that.remove);
            that.listenTo(model, 'visible', that.toggleVisible);

		},

		render: function () {
            var that = this;

            that.$el.html(that.template(that.model.toJSON()));
//            that.$el.toggleClass('completed', that.model.get('completed'));
//            that.toggleVisible();
            that.$input = that.$('.edit');
			return that;
		},

		toggleVisible: function () {
			this.$el.toggleClass('hidden', this.isHidden());
		},

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
			this.$input.focus();
		},

		close: function () {
			var value = this.$input.val();
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

		// If you hit `enter`, we're through editing the item.
		updateOnEnter: function (e) {
			if (e.which === 13) {
				this.close();
			}
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
        }
	});
})(jQuery);
