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
		required: 'ERROR_MSG.START_DATE_REQUIRED'
	},
	locale: {
		type: String,
		required: 'ERROR_MSG.LOCALE_REQUIRED',
		trim: true
	},
	price: {
		type: Number,
		required: 'ERROR_MSG.PRICE_REQUIRED'
	},
	serviceType: {
		type: Number,
		required: "ERROR_MSG.SERVICE_TYPE_REQUIRED"
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
