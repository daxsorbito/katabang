'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    Booking = mongoose.model('Booking'),
    _ = require('lodash');

/**
 * Create a Booking
 */
exports.create = function(req, res) {
    console.log('entered server create');
    var booking = new Booking(req.body);
    booking.user = req.user;

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
        req.booking = booking;
        next();
    });
};
