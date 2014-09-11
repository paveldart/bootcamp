(function ($) {
    var app = window.app || {};

	app.DraftView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#page',

		template: _.template($('#draft-template').html()),

		initialize: function () {
            var that = this;

            that.listenTo(app.heroes, 'reset', that.render);

            app.heroes.fetch({reset: true});
//            var tempObject = {};
//
//            $('tbody tr').each(function(){
//
//                if (this.className !== 'tableAd') {
//                    tempObject[$(this).find('.hero-link').text()] = $($(this).find('td')[3]).find('div').text().substr(0, 5)
//                }
//            });
//
//            console.log(JSON.stringify(tempObject));
        },

		render: function () {
			var that = this,
                heroes = app.heroes.toJSON()[0],
                select,
                options = '',
                hero;

            $(that.el).html(that.template());

            setTimeout(function(){
                select = $('#heroes-select');
                for (hero in heroes) {
                    options += '<option value="' + heroes[hero].name +'">' + heroes[hero].localized_name + '</option>';
                }

                select.append(options);

               $(that.el).find('.draft-wrapper').addClass('isVisible');
            }, 0);
		}
    });
})(jQuery);
