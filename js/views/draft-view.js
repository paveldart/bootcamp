(function ($) {
    var app = window.app || {};

	app.DraftView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#page',

		template: _.template($('#draft-template').html()),

        heroSelectedTemplate: _.template($('#selected-hero').html()),

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
                hero,
                currentHero;

            $(that.el).html(that.template());

            setTimeout(function(){
                select = $('#heroes-select');
                for (hero in heroes) {
                    options += '<option id="select-hero-' + heroes[hero].name + '" value="' + hero +'">' + heroes[hero].localized_name + '</option>';
                }

                select.append(options);

               $(that.el).find('.draft-wrapper').addClass('isVisible');

                select.change(function(){
                    var self = this,
                        value = heroes[self.value].name,
                        tempData = {},
                        counterPickHeroes = { count: 0 },
                        newCounterPickHeroes = {};
                    if (!app.cache.pickHeroes[value]) {
                        $.get('/data/heroes/' + value +'.json', function(result){
                            app.cache.pickHeroes[value] = result;
                            $('#select-hero-' + value)[0].disabled = true;

                            tempData.hero = self.value;
                            tempData.heroes = heroes;
                            $(that.el).find('#selected-heroes').append(that.heroSelectedTemplate(tempData));
                            $(that.el).find('.pick-title').addClass('isVisible');

                            for (hero in app.cache.pickHeroes) {
                                counterPickHeroes.count += 1;
                                for (currentHero in app.cache.pickHeroes[hero]) {
                                    if (!(counterPickHeroes[currentHero])) {
                                        counterPickHeroes[currentHero] = app.cache.pickHeroes[hero][currentHero];
                                    } else {
                                        counterPickHeroes[currentHero] = counterPickHeroes[currentHero] + '|' + app.cache.pickHeroes[hero][currentHero];
                                    }
                                }
                            }

                            for (hero in counterPickHeroes) {
                                var array,
                                    sum = 0,
                                    i;
                                if (counterPickHeroes[hero].length >= (5 * counterPickHeroes.count)) {
                                    array = counterPickHeroes[hero].split('|');
                                    for (i = array.length; i--;) {
                                        sum += array[i] - 0;
                                    }
                                    newCounterPickHeroes[(sum / counterPickHeroes.count) + ''] = hero;
                                }
                            }

                            console.log(newCounterPickHeroes);
                        });
                    }
                });
            }, 0);
		}
    });
})(jQuery);
