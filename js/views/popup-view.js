(function ($) {
    var app = window.app || {};

	// Popup View
	// --------------

	app.PopupView = Backbone.View.extend({
		// Cache the template function for a single item.
		template: _.template($('#popup-template').html()),

		events: {
            'click .icon-close': 'hidePopup'
		},

		initialize: function (options) {
            var that = this;

            _.bindAll(that, 'hidePopup');

            that.$el.addClass('popup-content');
            that.wrapperPopup = options.wrapperPopup;
            that.heroID = options.heroID;

            that.$el.on('click', that.hidePopup);

            that.render();
		},

		render: function () {
            var that = this,
                data = {
                    heroID: that.heroID,
                    heroes: app.heroes.toJSON()[0],
                    ourHeroes: app.cache.ourHeroes,
                    opponentsHeroes: app.cache.opponentsHeroes
                };

            that.wrapperPopup.html(that.$el.html(that.template(data)));

			return that;
		},

        hidePopup: function () {
            var $el = this.$el.parent();
            $el.removeClass('isVisible');
            $el.empty();
		}
	});
})(jQuery);
