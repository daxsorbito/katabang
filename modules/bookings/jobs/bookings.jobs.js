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

    function processSendingEmail(booking, last, done) {
    	// Todo: select users based of location
    	var userCriteria  = {
    		"address.city" : booking.booking.address.city, 
    		"address.prov_state": booking.booking.address.prov_state,
    		"address.country": booking.booking.address.country
    	};

    	User.find(userCriteria)
    		.limit(5)
    		.exec(function(err, users){
    			var usersLength = users.length;
				for (var i = 0; i < usersLength; i++) {
					sendIndividualEmail(users[i], booking, last && (i === (usersLength -1)), done)
				}
    		});
	}

    function sendIndividualEmail (user, booking, last, done){
    	crypto.randomBytes(20, function (err, buffer) {
	        var token = buffer.toString('hex');
	        var mailOptions = {
		        from: 'daxsorbito@gmail.com',
		        to: user.email,
		        subject: 'Booking request',
		        template: 'bookingServiceProvider',
		        context: {
		            name: user.displayName,
		            appName: config.app.title,
		            time: booking.booking.booking_time,
		            date: booking.booking.booking_date,
		            location: booking.booking.address.city + ', ' + booking.booking.address.prov_state,
		            url: config.app.url + '/api/auth/bookthisrequest/' + token
				}
		    };

		    smtpTransport.sendMail(mailOptions, function (err, data) {
		        if (!err) {
		          console.log(err);
		        } else {
		          console.log(data)
		        }
				var bookingRequest = new BookingRequest({
					booking: booking,
					service_provider: user,
					requestToken: token,
					requestExpires: Date.now() + (3600000 * 24 * 5) // 1 hour * 24 (convert to day) * 5(days)
				});
				bookingRequest.save(function(err, data){
					if (last) {
			        	console.log('[processBooking] executed at --> ' + (new Date));
			        	done()
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
	        .exec(function (err, bookings) {
	        	var bookingsLength = bookings.length;
				for (var i = 0; i < bookingsLength; i++) {
				    processSendingEmail(bookings[i], i === (bookingsLength -1), done)
				}
	        });
		
	});

    agenda.every('3 minutes', 'proccessServiceProviderEmail');
};
