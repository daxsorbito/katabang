'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Servicesoffered Permissions
 */
exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/servicesoffered',
            permissions: '*'
        }, {
            resources: '/api/servicesoffered/:serviceofferedId',
            permissions: '*'
        }]
    }, {
        roles: ['user'],
        allows: [{
            resources: '/api/servicesoffered',
            permissions: ['get', 'post']
        }, {
            resources: '/api/servicesoffered/:serviceofferedId',
            permissions: ['get']
        }]
    }, {
        roles: ['guest'],
        allows: [{
            resources: '/api/servicesoffered',
            permissions: ['get']
        }, {
            resources: '/api/servicesoffered/:serviceofferedId',
            permissions: ['get']
        }]
    }]);
};

/**
 * Check If Servicesoffered Policy Allows
 */
exports.isAllowed = function (req, res, next) {
    var roles = (req.user) ? req.user.roles : ['guest'];

    // If a servicesoffered is being processed and the current user created it then allow any manipulation
    if (req.serviceoffered && req.user && req.serviceoffered.user.id === req.user.id) {
        return next();
    }

    // Check for user roles
    acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
        if (err) {
            // An authorization error occurred.
            return res.status(500).send('Unexpected authorization error');
        } else {
            if (isAllowed) {
                // Access granted! Invoke next middleware
                return next();
            } else {
                return res.status(403).json({
                    message: 'User is not authorized'
                });
            }
        }
    });
};
