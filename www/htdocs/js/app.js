$(function () {
    var app = window.app || {};

	new app.AppView();

    app.cache = {
        ourHeroes: {
            count: 0
        },
        ourWinHeroes: {
            count: 0
        },
        opponentsHeroes: {
            count: 0
        },
        opponentsWinHeroes: {
            count: 0
        },
        isLoading: false
    }
});
