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
    async = require('async'),
    _ = require('lodash');

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
    res.jsonp(req.booking);
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
        // TODO: return scheduled booking
        ScheduledBooking.find({})
        req.booking = booking;
        next();
    });
};
