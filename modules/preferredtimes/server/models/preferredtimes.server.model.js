'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Preferredtime Schema
 */
var PreferredtimeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Preferredtime name',
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

mongoose.model('Preferredtime', PreferredtimeSchema);
