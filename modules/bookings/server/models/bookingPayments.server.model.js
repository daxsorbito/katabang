'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Booking Payment Schema
 */
var BookingPaymentSchema = new Schema({
    paymentId: {
        type: String,
        required: "PaymentId is required"
    },
    status: {
        type: Number,
        default: 0 // 0 - Pending, 1 - Processed, 2 - Cancelled
    },
    token: {
        type: String,
        required: "Token is required"
    },
    PayerID: {
        type: String,
        required: "PayerID is required"
    },
    booking : {
        type: Schema.ObjectId,
        ref: 'Booking',
        required: 'Booking is required'
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

mongoose.model('BookingPayment', BookingPaymentSchema);
