'use strict';

/**
 * Module dependencies.
 */
var locationsPolicy = require('../policies/locations.server.policy'),
    locations = require('../controllers/locations.server.controller');

module.exports = function (app) {
	// Locations collection routes
	app.route('/api/locations').all(locationsPolicy.isAllowed)
		.get(locations.list)
		.post(locations.create);

	// Single article routes
	app.route('/api/locations/:locationId').all(locationsPolicy.isAllowed)
		.get(locations.read)
		.put(locations.update)
		.delete(locations.delete);

	// Finish by binding the article middleware
	app.param('locationId', locations.locationByID);
};
