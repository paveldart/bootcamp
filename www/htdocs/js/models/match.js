var app = app || {};

(function () {

	// Match Model
	// ----------

	app.Match = Backbone.Model.extend({
		defaults: {
			win: false
		},

		toggle: function () {
			this.save({
//				completed: !this.get('completed')
			});
		}
	});
})();
