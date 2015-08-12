'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    Location = mongoose.model('Location'),
    _ = require('lodash');

/**
 * Create a Location
 */
exports.create = function(req, res) {
    var location = new Location(req.body);
    location.user = req.user;

    location.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(location);
        }
    });
};

/**
 * Show the current Location
 */
exports.read = function(req, res) {
    res.jsonp(req.location);
};

/**
 * Update a Location
 */
exports.update = function(req, res) {
    var location = req.location ;

    location = _.extend(location , req.body);

    location.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(location);
        }
    });
};

/**
 * Delete an Location
 */
exports.delete = function(req, res) {
    var location = req.location ;

    location.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(location);
        }
    });
};

/**
 * List of Locations
 */
exports.list = function(req, res) {
    Location.find().sort('-created').populate('user', 'displayName').exec(function(err, locations) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(locations);
        }
    });
};

/**
 * Location middleware
 */
exports.locationByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Location is invalid'
        });
    }

    Location.findById(id).populate('user', 'displayName').exec(function (err, location) {
        if (err) {
            return next(err);
        } else if (!location) {
            return res.status(404).send({
                message: 'No location with that identifier has been found'
            });
        }
        req.location = location;
        next();
    });
};
