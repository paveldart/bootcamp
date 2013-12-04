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

		lose: function () {
			return this.without.apply(this, this.win());
		},

        radiant: function () {
			return this.filter(function (match) {
				return match.get('result').radiant_team;
			});
		},

		dire: function () {
			return this.without.apply(this, this.radiant());
		},

		comparator: function (match) {
			return match.get('order');
		}
	});

	app.matches = new Matches();
})();
