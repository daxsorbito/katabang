'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * BookingRequest Schema
 */
var BookingRequestSchema = new Schema({
	scheduledBooking: {
	    type: Schema.ObjectId,
	    ref: 'ScheduledBooking',
	    required: "Booking id is required"
	},
	service_provider: {
		type: Schema.ObjectId,
	    ref: 'User',
	    required: "Service provider id is required"
	},
	requestToken: {
		type: String
	},
	requestExpires: {
		type: Date
	}

});

mongoose.model('BookingRequest', BookingRequestSchema);
