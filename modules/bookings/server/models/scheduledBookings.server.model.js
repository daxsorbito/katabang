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

ScheduledBookingSchema.virtual('statusStr').get(function(){
    if(this.status === 0)
        return 'BOOKING_STATUS.PENDING';
    else if(this.status === 1)
        return 'BOOKING_STATUS.EMAIL_SENT';
    else if(this.status === 2)
        return 'BOOKING_STATUS.ACCEPTED';
    else if(this.status === 3)
        return 'BOOKING_STATUS.DONE';
    else if(this.status === 4)
        return 'BOOKING_STATUS.BILLED';
    else if(this.status === 5)
        return 'BOOKING_STATUS.PAID';
    else if(this.status === 6)
        return 'BOOKING_STATUS.CANCELLED';
    else
        return '';
});

ScheduledBookingSchema.set('toJSON', {'virtuals': true});

mongoose.model('ScheduledBooking', ScheduledBookingSchema);
