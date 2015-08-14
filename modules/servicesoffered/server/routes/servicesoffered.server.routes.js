'use strict';

/**
 * Module dependencies.
 */
var servicesofferedPolicy = require('../policies/servicesoffered.server.policy'),
	servicesoffered = require('../controllers/servicesoffered.server.controller');

module.exports = function (app) {
	// Servicesoffered collection routes
	app.route('/api/servicesoffered').all(servicesofferedPolicy.isAllowed)
		.get(servicesoffered.list)
		.post(servicesoffered.create);

	// Single article routes
	app.route('/api/servicesoffered/:serviceofferedId').all(servicesofferedPolicy.isAllowed)
		.get(servicesoffered.read)
		.put(servicesoffered.update)
		.delete(servicesoffered.delete);

	// Finish by binding the article middleware
	app.param('serviceofferedId', servicesoffered.serviceofferedID);
};
