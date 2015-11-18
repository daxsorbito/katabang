'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function (password) {
  return (this.provider !== 'local' || validator.isLength(password, 6));
};

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'ERROR_MSG.FIRST_NAME_REQUIRED']
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'ERROR_MSG.LAST_NAME_REQUIRED']
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'ERROR_MSG.EMAIL_VALID']
  },
  username: {
    type: String,
    unique: 'ERROR_MSG.USER_NAME_EXIST',
    required: 'ERROR_MSG.USER_NAME_REQUIRED',
    trim: true
  },
  password: {
    type: String,
    default: '',
    validate: [validateLocalStrategyPassword, 'ERROR_MSG.PASSWORD_LENGTH']
  },
  salt: {
    type: String
  },
  profileImageURL: {
    type: String,
    default: 'modules/users/img/profile/default.png'
  },
  provider: {
    type: String,
    required: 'ERROR_MSG.PROVIDER_REQUIRED'
  },
  providerData: {},
  additionalProvidersData: {},
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin']
    }],
    default: ['user']
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  userType: {
    type: Number,
    default: 0 // 0 - Client; 1 - Provider
  },
  primaryService: {
    type: Number
  },
  otherServices :{
    type: [{
      type: Number
    }]
  },
  address : {
    address1: { type: String, required: 'ERROR_MSG.ADDRESS_REQUIRED' },
    city: { type: Number, required: 'ERROR_MSG.CITY_REQUIRED' },
    prov_state: { type: Number,  },
    zip_code: { type: String },
    country: { type: Number, required: 'ERROR_MSG.COUNTRY_REQUIRED' },
    telephone: { type: String, required: 'ERROR_MSG.TELEPHONE_REQUIRED' },
    mobilephone: { type: String, required: 'ERROR_MSG.MOBILEPHONE_REQUIRED' }
  },
  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  /* For activate user */
  verified: {
    type: Boolean,
    default: false
  },
  activateUserToken: {
   type: String
 },
 activateUserExpires: {
   type: Date
 }
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.isModified('password') && this.password.length > 6) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  var _this = this;
  var possibleUsername = username + (suffix || '');

  _this.findOne({
    username: possibleUsername
  }, function (err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

mongoose.model('User', UserSchema);
