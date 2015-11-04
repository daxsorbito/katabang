'use strict';

/**
 * Module dependencies.
 */
var bookingsPolicy = require('../policies/bookings.server.policy'),
	bookings = require('../controllers/bookings.server.controller');

module.exports = function (app) {
	// Bookings collection routes
	app.route('/api/bookings').all(bookingsPolicy.isAllowed)
		.get(bookings.list)
		.post(bookings.create);

	// Single article routes
	app.route('/api/bookings/:bookingId').all(bookingsPolicy.isAllowed)
		.get(bookings.read)
		.put(bookings.update)
		.delete(bookings.delete);

	// Finish by binding the article middleware
	app.param('bookingId', bookings.bookingID);
};