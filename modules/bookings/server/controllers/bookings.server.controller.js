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
    User = mongoose.model('User'),
    BookingRequest = mongoose.model('BookingRequest'),
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

exports.bookthisrequest = function (req, res, next) {
  var requestBooking = req.requestBooking;

  // Todo: search for the booking, and change the status to booked and update the service provider field
  ScheduledBooking.findOne({_id: requestBooking.scheduledBooking, status: 1})
    .exec(function (err, schedBooking) {
    if(err || !schedBooking) {
      return res.redirect('/authentication/signin?err=BOOKING_TAKEN');
    }
    ScheduledBooking.update({_id: schedBooking._id}, { $set: {status: 2, service_provider: requestBooking.service_provider}}, function(){
      return res.redirect('/authentication/signin?msg=BOOKING_SUCESS');
    });
  });
};

exports.userbookings = function(req, res) {
  ScheduledBooking.find({user: req.user._id})
    .populate('booking')
    .populate('service_provider')
    .exec(function (err, bookings) {
        if(err) {
            return res.status(400).send({
                message: 'Booking is invalid'
            });
        }
        res.jsonp(bookings);
    });
};

exports.providerbookings = function(req, res){
  ScheduledBooking.find({service_provider: req.user._id})
    .populate('booking')
    .populate('user', '-salt -password -activateUserExpires -activateUserToken' )
    .exec(function(err, bookings){
      if(err){
        return res.status(400).send({
          message: 'Booking is invalid'
        });
      }
      res.jsonp(bookings);
    });
};

exports.setBookingDone = function (req, res, next){
  var scheduledBookingId = req.body.scheduledBookingId;
  ScheduledBooking.findOne({_id: scheduledBookingId})
    .exec(function(err, schedBooking){
      if(err || !schedBooking){
        return res.status(400).send({
          message: 'ScheduledBooking is invalid'
        });
      }
      ScheduledBooking.update({_id: schedBooking._id}, {$set: {status: 3}}, function(){
        return res.status(200).send({
          message: 'Scheduled booking status changed to done.'
        });
      });
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

exports.verifyToken = function (req, res, next, token) {
  BookingRequest.findOne({
      requestToken: token,
      requestExpires: {
        $gt: Date.now()
      }}).exec(function (err, requestBooking) {
      if (err || !requestBooking) {
        return res.redirect('/authentication/signin?err=INVALID_BOOKING_REQUEST');
      }
      req.requestBooking = requestBooking;
      next();
  });
};

/**
  * UserId Check
  */
exports.userId = function(req, res, next, id){
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }
  
  User.findById(id).exec(function(err, user){
    
    if(err){
      return next(err);
    }else if (!user){
      return res.status(404).send({
        message: 'No user with that identifier has been found'
      });
    }
    req.user = user;
    next();
  });
};

/**
 * Scheduled booking check
 */
exports.scheduledBookingId = function(req, res, next, id){
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).send({
      message: 'Sheduled booking is not valid.'
    });
  }

  ScheduledBooking.findById(id).exec(function(err, scheduledBooking){
    if(err){
      return next(err);
    }else if(!scheduledBooking){
      return res.status(404).send({
        message: 'No scheduled booking with that identifies has been found'
      });
    }
    req.scheduledBooking = scheduledBooking;
    next();
  });
};
