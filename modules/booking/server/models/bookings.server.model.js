'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Booking Schema
 */
var BookingSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Booking name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Booking', BookingSchema);
