'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    Servicesoffered = mongoose.model('Servicesoffered'),
    _ = require('lodash');

/**
 * Create a Servicesoffered
 */
exports.create = function(req, res) {
    var serviceoffered = new Servicesoffered(req.body);
    serviceoffered.user = req.user;

    serviceoffered.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(serviceoffered);
        }
    });
};

/**
 * Show the current Servicesoffered
 */
exports.read = function(req, res) {
    res.jsonp(req.serviceoffered);
};

/**
 * Update a Servicesoffered
 */
exports.update = function(req, res) {
    var serviceoffered = req.serviceoffered ;

    serviceoffered = _.extend(serviceoffered , req.body);

    serviceoffered.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(serviceoffered);
        }
    });
};

/**
 * Delete an Servicesoffered
 */
exports.delete = function(req, res) {
    var serviceoffered = req.serviceoffered ;

    serviceoffered.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(serviceoffered);
        }
    });
};

/**
 * List of Servicesoffered
 */
exports.list = function(req, res) {
    Servicesoffered.find().sort('-created').populate('user', 'displayName').exec(function(err, serviceoffered) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(serviceoffered);
        }
    });
};

/**
 * Servicesoffered middleware
 */
exports.serviceofferedID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Services offered is invalid'
        });
    }

    Servicesoffered.findById(id).populate('user', 'displayName').exec(function (err, serviceoffered) {
        if (err) {
            return next(err);
        } else if (!serviceoffered) {
            return res.status(404).send({
                message: 'No services offered with that identifier has been found'
            });
        }
        req.serviceoffered = serviceoffered;
        next();
    });
};
