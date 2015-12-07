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
	booking: {
	    type: Schema.ObjectId,
	    ref: 'Booking',
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
