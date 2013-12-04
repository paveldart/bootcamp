(function () {
    var app = window.app || {};

	// Mathes Collection
	// ---------------

	var Matches = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: app.Match,

        url: '/data/matches.json',

        win: function () {
			return this.filter(function (match) {
				return match.get('win');
			});
		},

		loses: function () {
			return this.without.apply(this, this.win());
		},

		comparator: function (match) {
			return match.get('order');
		}
	});

	app.matches = new Matches();
})();
