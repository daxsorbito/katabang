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
		type: Number,
		required: "Booking time is required"
	},
	duration: {
		type: Number,
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

BookingSchema.virtual('serviceTypeStr').get(function(){
	if(this.serviceType === 1)
		return 'SERVICES.HOUSE_CLEANER';
	else if(this.serviceType === 2)
		return 'SERVICES.LAUNDRY_PRESS';
	else if(this.serviceType === 3)
		return 'SERVICES.CARETAKER_OLDSITTER';
	else if(this.serviceType === 4)
		return 'SERVICES.CARETAKER_BABYSITTER';
	else if(this.serviceType === 5)
		return 'SERVICES.PLUMBER';
	else if(this.serviceType === 6)
		return 'SERVICES.AIRCON_CLEANER';
	else if(this.serviceType === 7)
		return 'SERVICES.HOUSE_FIXTURES_INSTALLER';
	else if(this.serviceType === 8)
		return 'SERVICES.GARDENER';
	else if(this.serviceType === 9)
		return 'SERVICES.HANDYMAN';
	else
		return '';
});

BookingSchema.set('toJSON', {'virtuals': true});

mongoose.model('Booking', BookingSchema);
