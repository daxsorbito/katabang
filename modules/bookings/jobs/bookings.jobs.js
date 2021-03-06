var path = require('path'),
    mongoose = require('mongoose'),
    Booking = mongoose.model('Booking'),
    Pricing = mongoose.model('Pricing'),
    User = mongoose.model('User');
    BookingRequest = mongoose.model('BookingRequest'),
    ScheduledBooking = mongoose.model('ScheduledBooking'),
    config = require(path.resolve('./config/config')),
    async = require('async'),
		crypto = require('crypto'),
    nodemailer = require('nodemailer'),
    nbs = require('nodemailer-express-handlebars')
    handlebars = require('express-handlebars'),
    ses = require('nodemailer-ses-transport');


module.exports = function (agenda) {
	var viewEngine = handlebars.create({});

	var smtpTransport = nodemailer.createTransport(ses({
	  accessKeyId: 'AKIAJILT4UGK6WDMBQNQ',
	  secretAccessKey: '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'
	}));

	var handlebarMailer = nbs({
    viewEngine: viewEngine,
    viewPath: path.resolve(__dirname, './templates')
  });

  smtpTransport.use('compile', handlebarMailer);

  // Todo: this should be in DB -> to be refactored
  function getFormattedCityAndCountry(cityId, countryId) {
  	var output = [];
  	switch (cityId) {
    	case 1: {
    		output.push('Cebu');
    		break;
    	}
    	case 2: {
    		output.push('Mandaue');
    		break;
    	}
    	case 3: {
    		output.push('Lapu-lapu');
    		break;
    	}
    	case 4: {
    		output.push('Talisay');
    		break;
    	}
    	case 5: {
    		output.push('Manila-Pasay');
    		break;
    	}
    	case 6: {
    		output.push('Makati');
    		break;
    	}
    	case 7: {
    		output.push('Ortigas');
    		break;
    	}
    	case 8: {
    		output.push('Taguig');
    		break;
    	}
    	case 9: {
    		output.push('Tokyo');
    		break;
    	}
    	case 10: {
    		output.push('Seoul');
    		break;
    	}
    	case 11: {
    		output.push('Singapore');
    		break;
    	}
    }
    switch (countryId) {
    	case 1: {
    		output.push('Philippines');
    		break;
    	}
    	case 2: {
    		output.push('Japan');
    		break;
    	}
    	case 3: {
    		output.push('Korea');
    		break;
    	}
    	case 4: {
    		output.push('Hong Kong');
    		break;
    	}
    	case 5: {
    		output.push('Singapore');
    		break;
    	}
    }

    return output.join(', ');
  }

  function processSendingEmail(schedBookings, last, done) {
  	// Todo: select users based of location
  	var userCriteria  = {
  		"address.city" : schedBookings.booking.address.city, 
  		"address.prov_state": schedBookings.booking.address.prov_state,
  		"address.country": schedBookings.booking.address.country,
      "userType": 1
  	};

  	User.find(userCriteria)
  		.limit(5) // only 5 
  		.exec(function(err, users){
  			var usersLength = users.length;
			for (var i = 0; i < usersLength; i++) {
				sendIndividualEmail(users[i], schedBookings, last && (i === (usersLength -1)), done)
			}
  		});
	}

  function sendIndividualEmail (user, schedBooking, last, done){
  	crypto.randomBytes(20, function (err, buffer) {
      var token = buffer.toString('hex');
      var mailOptions = {
        from: config.mailer.from,
        to: user.email,
        subject: 'Booking request',
        template: 'bookingServiceProvider',
        context: {
          name: user.displayName,
          appName: config.app.title,
          time: schedBooking.booking.booking_time,
          date: schedBooking.booking.booking_date,
          location: getFormattedCityAndCountry(schedBooking.booking.address.city,  schedBooking.booking.address.prov_state),
          url: config.app.url + '/api/bookthisrequest/' + token
				}
    };

	  smtpTransport.sendMail(mailOptions, function (err, data) {
	    var bookingRequest = new BookingRequest({
				scheduledBooking: schedBooking,
				service_provider: user,
				requestToken: token,
				requestExpires: Date.now() + (3600000 * 24 * 5) // 1 hour * 24 (convert to day) * 5(days)
			});
			bookingRequest.save(function(err, data){
				if (last) {
					ScheduledBooking.update({_id: schedBooking._id}, { $set: {status: 1}}, function(){
						console.log('[proccessServiceProviderEmail] executed at --> ' + (new Date));	
						done();
					});
		    };
			});
	    });
    });
	}

	agenda.define('proccessServiceProviderEmail', function(job, done) {
		ScheduledBooking.find({status: 0})
      .populate('booking')
      .populate('service_provider')
      .populate('pricing')
      .exec(function (err, schedBookings) {
      	if(err || !schedBookings || schedBookings.length === 0) {
      		return done();
      	}
      	var bookingsLength = schedBookings.length;
				for (var i = 0; i < bookingsLength; i++) {
				    processSendingEmail(schedBookings[i], i === (bookingsLength -1), done)
				}
		});
	});

	agenda.define('reprocessUnacceptedRequests', function(job, done) {
		// Todo
		// 1. What if booking_date is overdue already
		// 2. What if after 5 days no-one accepts the reqeust


	});


	agenda.define('processPayment', function(job, done) {
		// Todo: execute paypal payment here
	});

  agenda.every('3 minutes', 'proccessServiceProviderEmail');
};
