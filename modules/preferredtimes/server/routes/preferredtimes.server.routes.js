'use strict';

/**
 * Module dependencies.
 */
var preferredtimesPolicy = require('../policies/preferredtimes.server.policy'),
	preferredtimes = require('../controllers/preferredtimes.server.controller');

module.exports = function (app) {
	// Preferredtimes collection routes
	app.route('/api/preferredtimes').all(preferredtimesPolicy.isAllowed)
		.get(preferredtimes.list)
		.post(preferredtimes.create);

	// Single article routes
	app.route('/api/preferredtimes/:preferredtimeId').all(preferredtimesPolicy.isAllowed)
		.get(preferredtimes.read)
		.put(preferredtimes.update)
		.delete(preferredtimes.delete);

	// Finish by binding the article middleware
	app.param('preferredtimeId', preferredtimes.preferredtimeID);
};
