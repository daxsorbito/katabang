'use strict';

/**
 * Module dependencies.
 */
var pricingsPolicy = require('../policies/pricings.server.policy'),
    pricings = require('../controllers/pricings.server.controller');

module.exports = function (app) {
	// Pricings collection routes
	app.route('/api/pricings').all(pricingsPolicy.isAllowed)
		.get(pricings.list)
		.post(pricings.create);

	// Single article routes
	app.route('/api/pricings/:pricingLocale').all(pricingsPolicy.isAllowed)
		.get(pricings.read)
		.put(pricings.update)
		.delete(pricings.delete);

	// Finish by binding the article middleware
	app.param('pricingLocale', pricings.pricingLocale);
};
