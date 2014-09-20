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
//                    var currentText = $($(this).find('td')[2]).text().substr(0, 5);
//                    tempObject[$(this).find('.hero-link').text()] = (currentText.substr(0, 1) === '-') ? currentText : currentText.substr(0, 4);
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
                var tempHeroes = ["Abaddon", "Alchemist", "Ancient Apparition", "Anti-Mage", "Axe", "Bane", "Batrider", "Beastmaster", "Bloodseeker", "Bounty Hunter", "Brewmaster", "Bristleback", "Broodmother", "Centaur Warrunner", "Chaos Knight", "Chen", "Clinkz", "Clockwerk", "Crystal Maiden", "Dark Seer", "Dazzle", "Death Prophet", "Disruptor", "Doom", "Dragon Knight", "Drow Ranger", "Earthshaker", "Earth Spirit", "Elder Titan", "Ember Spirit", "Enchantress", "Enigma", "Faceless Void", "Gyrocopter", "Huskar", "Invoker", "Io", "Jakiro", "Juggernaut", "Keeper of the Light", "Kunkka", "Legion Commander", "Leshrac", "Lich", "Lifestealer", "Lina", "Lion", "Lone Druid", "Luna", "Lycan", "Magnus", "Medusa", "Meepo", "Mirana", "Morphling", "Naga Siren", "Nature's Prophet", "Necrophos", "Night Stalker", "Nyx Assassin", "Ogre Magi", "Omniknight", "Outworld Devourer", "Phantom Assassin", "Phantom Lancer", "Phoenix", "Puck", "Pudge", "Pugna", "Queen of Pain", "Razor", "Riki", "Rubick", "Sand King", "Shadow Demon", "Shadow Fiend", "Shadow Shaman", "Silencer", "Skywrath Mage", "Slardar", "Slark", "Sniper", "Spectre", "Spirit Breaker", "Storm Spirit", "Sven", "Techies", "Templar Assassin", "Terrorblade", "Tidehunter", "Timbersaw", "Tinker", "Tiny", "Treant Protector", "Troll Warlord", "Tusk", "Undying", "Ursa", "Vengeful Spirit", "Venomancer", "Viper", "Visage", "Warlock", "Weaver", "Windranger", "Witch Doctor", "Wraith King", "Zeus"];
                select = $('#heroes-select');

                for (var j = 0, jMax = tempHeroes.length; j < jMax; j+=1) {
                    for (hero in heroes) {
                        if (heroes[hero].localized_name === tempHeroes[j]) {
                            options += '<option id="select-hero-' + heroes[hero].name + '" value="' + hero +'">' + heroes[hero].localized_name + '</option>';
                        }
                    }
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
                                    i,
                                    tempArray;
                                if (counterPickHeroes[hero].length >= (4 * counterPickHeroes.count)) {
                                    array = counterPickHeroes[hero].split('|');
                                    for (i = array.length; i--;) {
                                        sum += array[i] - 0;
                                    }
                                    if (newCounterPickHeroes[sum]) {
                                        tempArray = [newCounterPickHeroes[(sum / counterPickHeroes.count) + '']];
                                        tempArray.push(hero);
                                        newCounterPickHeroes[sum] = tempArray;
                                    } else {
                                        newCounterPickHeroes[sum] = hero;
                                    }
                                }
                            }

                            $(that.el).find('#counter-selected-heroes').empty();
                            var newCounterPickHeroesArray = [];

                            for (hero in newCounterPickHeroes) {
                                tempArray;
                                if (typeof newCounterPickHeroes[hero] === 'string') {
                                    tempArray = [];
                                    tempArray.push(hero, newCounterPickHeroes[hero]);
                                    newCounterPickHeroesArray.push(tempArray);
                                } else {
                                    for (i = newCounterPickHeroes[hero].length; i-- ; ) {
                                        tempArray = [];
                                        tempArray.push(hero, newCounterPickHeroes[hero][i]);
                                        newCounterPickHeroesArray.push(tempArray);
                                    }
                                }
                            }

                            function sortFunction(a, b){
                                if(a[0] - 0 < b[0] - 0) {
                                    return -1
                                } else if (a[0] - 0 > b[0] - 0) {
                                    return 1
                                } else {
                                    return 0;
                                }
                            }

                            newCounterPickHeroesArray = newCounterPickHeroesArray.sort(sortFunction);

                            $(that.el).find('#counter-selected-heroes').empty();

                            for (i = 0; i < 6; i+=1) {
                                for (hero in heroes) {
                                    if (newCounterPickHeroesArray[i][1] === heroes[hero].localized_name) {
                                        tempData.hero = hero;
                                        tempData.heroes = heroes;

                                        $(that.el).find('#counter-selected-heroes').append(that.heroSelectedTemplate(tempData));
                                    }
                                }
                            }
                        });
                    }
                });
            }, 0);
		}
    });
})(jQuery);
