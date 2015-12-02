'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Booking Permissions
 */
exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/bookings',
            permissions: '*'
        }, {
            resources: '/api/bookings/:bookingId',
            permissions: '*'
        },{
            resources: '/api/bookings/pay',
            permissions: '*'
        }]
    }, {
        roles: ['user'],
        allows: [{
            resources: '/api/bookings',
            permissions: ['get', 'post']
        }, {
            resources: '/api/bookings/:bookingId',
            permissions: ['get']
        },{
            resources: '/api/bookings/pay',
            permissions: '*'
        }]
    }, {
        roles: ['guest'],
        allows: [{
            resources: '/api/bookings',
            permissions: ['get']
        }, {
            resources: '/api/bookings/:bookingId',
            permissions: ['get']
        }]
    }]);
};

/**
 * Check If Booking Policy Allows
 */
exports.isAllowed = function (req, res, next) {
    console.log('entered isAllowed 1');
    var roles = (req.user) ? req.user.roles : ['guest'];

    // If a booking is being processed and the current user created it then allow any manipulation
    if (req.booking && req.user && req.booking.user.id === req.user.id) {
        console.log('entered isAllowed 2');
        return next();
    }

    // Check for user roles
    acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
        console.log('entered isAllowed 3');
        if (err) {
            console.log('entered isAllowed 4');
            // An authorization error occurred.
            return res.status(500).send('Unexpected authorization error');
        } else {
            console.log('entered isAllowed 5');
            if (isAllowed) {
                console.log('entered isAllowed 6');
                // Access granted! Invoke next middleware
                return next();
            } else {
                console.log('entered isAllowed 7');
                return res.status(403).json({
                    message: 'User is not authorized'
                });
            }
        }
    });
};
