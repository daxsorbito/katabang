'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Scheduled Booking Schema
 */
var ScheduledBookingSchema = new Schema({
    booking_date: {
        type: Date,
        required: "Date is required"
    },
    status: {
        type: Number,
        default: 0 // 0 - Pending, 1 - EmailSent, 2 -  Accepted, 3 - Done, 4 - Billed, 5 - Payed, -1 - Cancelled
    },
    booking: {
        type: Schema.ObjectId,
        ref: 'Booking',
        required: "Booking id is required"
    },
    service_provider: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    pricing : {
        type: Schema.ObjectId,
        ref: 'Pricing',
        required: 'Pricing is required'
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

mongoose.model('ScheduledBooking', ScheduledBookingSchema);
