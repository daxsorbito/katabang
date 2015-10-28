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
	service_type: {
		type: Number,
		required: "Service type is required"
	},
	location: {
		type: Number,
		required: "Location is required"
	},
	booking_date: {
		type: Date,
		required: "Date is required"
	},
	preferred_time: {
		type: String,
		required: "Preferred time is required"
	},
	duration: {
		type: String,
		required: "Service duration is required"
	},
	recurring: {
		type: Boolean,
		default: 0
	},
	interval: {
		type: Number,
		default: 0
	},
	address : {
		address1: { type: String, required: 'Address is required' },
		city: { type: Number, required: 'City is required' },
		prov_state: { type: Number,  },
		zip_code: { type: String },
		country: { type: Number, required: 'Country is required' },
		telephone: { type: String, required: 'Telephone is required' },
		mobilephone: { type: String, required: 'Mobilephone is required' }
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
