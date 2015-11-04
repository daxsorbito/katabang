'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pricing Schema
 */
var PricingSchema = new Schema({
	startDate: {
		type: Date,
		required: 'Start date is required'
	},
	locale: {
		type: String,
		required: 'Locale is required',
		trim: true
	},
	price: {
		type: Number,
		required: 'Price is required'
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

mongoose.model('Pricing', PricingSchema);
