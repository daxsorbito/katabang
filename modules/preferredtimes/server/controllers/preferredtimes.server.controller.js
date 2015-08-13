'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    Preferredtime = mongoose.model('Preferredtime'),
    _ = require('lodash');

/**
 * Create a Preferredtime
 */
exports.create = function(req, res) {
    var preferredtime = new Preferredtime(req.body);
    preferredtime.user = req.user;

    preferredtime.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(preferredtime);
        }
    });
};

/**
 * Show the current Preferredtime
 */
exports.read = function(req, res) {
    res.jsonp(req.preferredtime);
};

/**
 * Update a Preferredtime
 */
exports.update = function(req, res) {
    var preferredtime = req.preferredtime ;

    preferredtime = _.extend(preferredtime , req.body);

    preferredtime.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(preferredtime);
        }
    });
};

/**
 * Delete an Preferredtime
 */
exports.delete = function(req, res) {
    var preferredtime = req.preferredtime ;

    preferredtime.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(preferredtime);
        }
    });
};

/**
 * List of Preferredtime
 */
exports.list = function(req, res) {
    Preferredtime.find().sort('-created').populate('user', 'displayName').exec(function(err, preferredtime) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(preferredtime);
        }
    });
};

/**
 * Preferredtime middleware
 */
exports.preferredtimeID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Preferredtime is invalid'
        });
    }

    Preferredtime.findById(id).populate('user', 'displayName').exec(function (err, preferredtime) {
        if (err) {
            return next(err);
        } else if (!preferredtime) {
            return res.status(404).send({
                message: 'No preferredtime with that identifier has been found'
            });
        }
        req.preferredtime = preferredtime;
        next();
    });
};
