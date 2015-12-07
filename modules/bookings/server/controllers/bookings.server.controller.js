'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    Booking = mongoose.model('Booking'),
    Pricing = mongoose.model('Pricing'),
    ScheduledBooking = mongoose.model('ScheduledBooking'),
    BookingPayment = mongoose.model('BookingPayment'),
    paypal = require('paypal-rest-sdk'),
    config = require(path.resolve('./config/config')),
    async = require('async'),
    _ = require('lodash');


paypal.configure({
    client_id: config.paypal.clientID,
    client_secret: config.paypal.clientSecret,
    mode: 'sandbox'
});

/**
 * Create a Booking
 */


exports.create = function(req, res) {
    var booking = new Booking(req.body);
    var pricing = new Pricing(req.body.pricing);
    var scheduledBookings  = req.body.scheduledBookings;
    booking.user = req.user;

    async.waterfall([
        function (done) {
            booking.save(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                done(err, booking);
            });
        },
        function(booking){
            function respondError(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
            }
            var schedLength = scheduledBookings.length;
            for(var x = 0; x < schedLength; x++){
                var schedBooking = new ScheduledBooking(scheduledBookings[x]);
                schedBooking.user = booking.user;
                schedBooking.pricing = pricing;
                schedBooking.booking = booking;
                schedBooking.save(respondError);
            }
            return res.jsonp(booking);
        }],
        function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
        }
    );
};

/**
 * Show the current Booking
 */
exports.read = function(req, res) {
    ScheduledBooking.find({booking: req.booking._id})
        .populate('booking')
        .populate('service_provider')
        .populate('pricing')
        .exec(function (err, bookings) {
            if(err) {
                return res.status(400).send({
                    message: 'Booking is invalid'
                });
            }
            res.jsonp(bookings);
        });
};

/**
 * Update a Booking
 */
exports.update = function(req, res) {
    var booking = req.booking ;

    booking = _.extend(booking , req.body);

    booking.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(booking);
        }
    });
};

/**
 * Delete an Booking
 */
exports.delete = function(req, res) {
    var booking = req.booking ;

    booking.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(booking);
        }
    });
};

/**
 * List of Booking
 */
exports.list = function(req, res) {
    Booking.find().sort('-created').populate('user', 'displayName').exec(function(err, booking) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(booking);
        }
    });
};


/**
 * Process payment
 */
exports.pay = function(req, res) {
    var postedData = req.body;

    var payment = {
        "intent": "sale",
        "payer": {},
        "transactions": [{
            "amount": {
                "currency": postedData.pricing.currency,
                "total": postedData.amountDue
            }
        }]
    };
    
    payment.payer.payment_method = 'paypal';
    payment.redirect_urls = {
        "return_url": config.app.url + '/bookings/executePayment/' + postedData._id + '/',
        "cancel_url": config.app.url + '/bookings/cancelPayment' + postedData._id + '/'
    };

    paypal.payment.create(payment, function (error, payment) {
        if (error) {
            return res.status(400).send({
                message: "Error processing payment"
            });
        } else {
            req.session.paymentId = payment.id;
            res.json(payment);
        }
    });
};

exports.executePay = function(req, res) {
    var bookingPayment = new BookingPayment(req.body);
    var bookingPaymentToUpdate = {};
    bookingPaymentToUpdate = Object.assign(bookingPaymentToUpdate, bookingPayment._doc);
    bookingPaymentToUpdate.status = 0; // set to pending
    delete bookingPaymentToUpdate._id;

    BookingPayment.findOneAndUpdate({paymentId: bookingPayment.paymentId}, bookingPaymentToUpdate, {upsert: true}, 
        function(err, payment){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                return res.jsonp(payment);
            }
    );
};

/**
 * Booking middleware
 */
exports.bookingID = function (req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Booking is invalid'
        });
    }

    Booking.findById(id).populate('user', 'displayName').exec(function (err, booking) {
        if (err) {
            return next(err);
        } else if (!booking) {
            return res.status(404).send({
                message: 'No booking with that identifier has been found'
            });
        }
        req.booking = booking;
        next();
    });
};
