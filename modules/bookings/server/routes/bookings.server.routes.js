'use strict';

/**
 * Module dependencies.
 */
var bookingsPolicy = require('../policies/bookings.server.policy'),
	bookings = require('../controllers/bookings.server.controller');

module.exports = function (app) {
	app.route('/api/bookings/pay').all(bookingsPolicy.isAllowed)
		.post(bookings.pay);

	app.route('/api/bookings/executePay').all(bookingsPolicy.isAllowed)
		.post(bookings.executePay);

	// Bookings collection routes
	app.route('/api/bookings').all(bookingsPolicy.isAllowed)
		.get(bookings.list)
		.post(bookings.create);

	app.route('/api/bookthisrequest/:bookingToken')
		.get(bookings.bookthisrequest);

	// Single article routes
	app.route('/api/bookings/:bookingId').all(bookingsPolicy.isAllowed)
		.get(bookings.read)
		.put(bookings.update)
		.delete(bookings.delete);

	// Finish by binding the article middleware
	app.param('bookingId', bookings.bookingID);
	app.param('bookingToken', bookings.verifyToken);
};
