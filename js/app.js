$(function () {
    var app = window.app || {};

    Backbone.history.start();

    app.cache = {
        pickHeroes: {},
        pickOpponentsHeroes: {},
        ourHeroes: {
            count: 0
        },
        ourWinRateHeroes: {},
        ourKDARateHeroes: {},
        ourWinHeroes: {
            count: 0
        },
        opponentsHeroes: {
            count: 0
        },
        opponentsWinRateHeroes: {},
        opponentsWinHeroes: {
            count: 0
        },
        isLoading: false
    }
});
