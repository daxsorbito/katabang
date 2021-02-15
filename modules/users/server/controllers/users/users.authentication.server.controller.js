'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User'),
  rp  = require('request-promise'),
  config = require(path.resolve('./config/config')),
  nodemailer = require('nodemailer'),
  crypto = require('crypto'),
  ses = require('nodemailer-ses-transport'),
  async = require('async');

  var smtpTransport = nodemailer.createTransport(ses({
    accessKeyId: 'AKIAJILT4UGK6WDMBQNQ',
    secretAccessKey: '<SECRET_KEY>'
  }));

//require('request-promise').debug = true;
//require('request-debug')(rp);

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init Variables
  var user = new User(req.body);
  var message = null;

  var post_data = {
    secret: config.reCaptcha.secretKey,
    response: req.body['g-response']
  };

  var post_options = {
    uri: config.reCaptcha.uri,
    method: 'POST',
    json: true,
    form: post_data
  };

  rp(post_options)
      .then(function(response) {
        if (response.success) {
          //Generate token
          crypto.randomBytes(20, function (err, buffer) {
            var token = buffer.toString('hex');
            user.provider = 'local';
            user.displayName = user.firstName + ' ' + user.lastName;
            user.verified = false;
            user.activateUserToken = token;
            user.activateUserExpires = Date.now() + 3600000; // 1 hour

            // Then save the user
            user.save(function (err) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                // Remove sensitive data before login
                user.password = undefined;
                user.salt = undefined;

                // req.login(user, function (err) {
                //   if (err) {
                //     res.status(400).send(err);
                //   } else {
                //     res.json(user);
                //   }
                // });

                res.render(path.resolve('modules/users/server/templates/activate-user-email'), {
                  name: user.displayName,
                  appName: config.app.title,
                  url: 'http://' + req.headers.host + '/api/auth/activate/' + token
                }, function (err, emailHTML) {
                    var mailOptions = {
                      to: user.email,
                      from: config.mailer.from,
                      subject: 'Activate Account',
                      html: emailHTML
                    };
                    smtpTransport.sendMail(mailOptions, function (err) {
                      if (!err) {
                        res.json(user);
                      } else {
                        return res.status(400).send({
                          message: 'Failure sending email'
                        });
                      }
                    });
                });

              }
            });

          });
        } else {
          res.status(400).send({message:'ERROR_MSG.CAPTCHA_REQUIRED'});
        }
      })
      .catch(function(err){
        res.status(400).send(err);
      });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      if(!user.verified){
        res.status(400).send({"message": "USER_NOT_VERIFIED"});
      }
      else{
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
  * Activate
  */
exports.activate = function (req, res){
  var token = req.params.token;
  User.findOne({
    activateUserToken: token,
    activateUserExpires: {
      $gt: Date.now()
    }
  }, function(err, user){
    if (!user) {
      return res.redirect('/authentication/signin?err=USER_NOT_FOUND');
    }
    else {
      user.verified = true;
      user.save(function(err){
        if(err) {
          return res.redirect('/authentication/signin?err=USER_ACTIVATION_ERROR');
        }
        else {
          return res.redirect('/authentication/signin?msg=USER_ACTIVATION_SUCCESS');
        }
      });
    }
  });
};

/**
 * Resend activation email
 */
exports.resendActivation = function (req, res, next) {
  async.waterfall([
    // Generate random token
    function (done) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },
    // Lookup user by username
    function (token, done) {
      if (req.body.username) {
        User.findOne({
          username: req.body.username
        }, '-salt -password', function (err, user) {
          if (!user) {
            return res.status(400).send({
              message: 'No account with that username has been found'
            });
          } else if (user.provider !== 'local') {
            return res.status(400).send({
              message: 'It seems like you signed up using your ' + user.provider + ' account'
            });
          } else {
            user.activateUserToken = token;
            user.activateUserExpires = Date.now() + 3600000; // 1 hour

            user.save(function (err) {
              done(err, token, user);
            });
          }
        });
      } else {
        return res.status(400).send({
          message: 'Username field must not be blank'
        });
      }
    },
    function (token, user, done) {
      res.render(path.resolve('modules/users/server/templates/activate-user-email'), {
        name: user.displayName,
        appName: config.app.title,
        url: 'http://' + req.headers.host + '/api/auth/activate/' + token
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Activate Account',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({
            message: 'An email has been sent to the provided email with further instructions.'
          });
        } else {
          return res.status(400).send({
            message: 'Failure sending email'
          });
        }

        done(err);
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};


/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
      req.session.redirect_to = req.query.redirect_to;
    }
    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {
    // Pop redirect URL from session
    var sessionRedirectURL = req.session.redirect_to;
    delete req.session.redirect_to;

    passport.authenticate(strategy, function (err, user, redirectURL) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        return res.redirect(redirectURL || sessionRedirectURL || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // And save the user
            user.save(function (err) {
              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, '/settings/accounts');
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};
