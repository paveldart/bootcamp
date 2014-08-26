/*global Backbone, jQuery, _ */
(function ($) {
    var app = window.app || {};

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.PageView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#page',

		template: _.template($('#page-template').html()),

		initialize: function () {
            this.render();
        },

		render: function () {
			var that = this;

            $(that.el).html(that.template());

            new app.AppView();
		}
    });
})(jQuery);
