/*global Backbone, jQuery, _ */
(function ($) {
    var app = window.app || {};

	app.DraftView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#page',

		template: _.template($('#draft-template').html()),

		initialize: function () {
            this.render();
        },

		render: function () {
			var that = this;

            $(that.el).html(that.template());
		}
    });
})(jQuery);
