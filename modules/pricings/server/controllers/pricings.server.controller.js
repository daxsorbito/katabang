'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    Pricing = mongoose.model('Pricing'),
    _ = require('lodash');

/**
 * Create a Pricing
 */
exports.create = function(req, res) {
    var pricing = new Pricing(req.body);
    pricing.user = req.user;

    pricing.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(pricing);
        }
    });
};

/**
 * Show the current Pricing
 */
exports.read = function(req, res) {
    res.jsonp(req.pricing);
};

/**
 * Update a Pricing
 */
exports.update = function(req, res) {
    var pricing = req.pricing ;

    pricing = _.extend(pricing , req.body);

    pricing.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(pricing);
        }
    });
};

/**
 * Delete an Pricing
 */
exports.delete = function(req, res) {
    var pricing = req.pricing ;

    pricing.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(pricing);
        }
    });
};

/**
 * List of Pricings
 */
exports.list = function(req, res) {
    Pricing.find().sort('-created').populate('user', 'displayName').exec(function(err, pricings) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(pricings);
        }
    });
};

/**
 * Pricing middleware
 */
exports.pricingLocale = function (req, res, next, locale) {
    Pricing.findOne({locale: locale}).sort({startDate: -1}).populate('user', 'displayName').exec(function (err, pricing) {
        if (err) {
            return next(err);
        } else if (!pricing) {
            return res.status(404).send({
                message: 'No pricing with that identifier has been found'
            });
        }
        req.pricing = pricing;
        next();
    });
};
