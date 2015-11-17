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
	serviceType: {
		type: Number,
		required: "Service type is required"
	},
	booking_date: {
		type: Date,
		required: "Date is required"
	},
	booking_time: {
		type: String,
		required: "Booking time is required"
	},
	duration: {
		type: String,
		required: "Service duration is required"
	},
	recurring: {
		type: Boolean,
		default: 0
	},
	frequency: {
		type: Number
	},
	frequency_until_date: {
		type: Date
	},
	address : {
		address1: { type: String, required: 'Address is required' },
		city: { type: Number, required: 'City is required' },
		prov_state: { type: Number },
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
