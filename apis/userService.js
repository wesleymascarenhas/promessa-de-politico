var User           = require('../models/models').User,
    modelUtils     = require('../utils/modelUtils'),
    helper         = require('../utils/helper'),
    Promise        = require('bluebird'),
    _              = require('underscore');

function forge(attributes) {
  var user = User.forge(modelUtils.filterAttributes('User', attributes));
  if(!user.get('username')) {
    user.set('username', helper.slugify(user.get('name')));
  }
  return user;
}

exports.createByFacebookAccount = function(name, gender, username, email, facebook_account) {
  return forge({ name: name, gender: gender, username: username, email: email, facebook_account: facebook_account }).save();
}

exports.createByTwitterAccount = function(name, gender, username, email, twitter_account) {
  return forge({ name: name, gender: gender, username: username, email: email, twitter_account: twitter_account }).save();
}

exports.createByGoogleAccount = function(name, gender, username, email, google_account) {
  return forge({ name: name, gender: gender, username: username, email: email, google_account: google_account }).save();
}

exports.update = function(user, attributes) {
  return user.save(user.pick(attributes), {patch: true});
}

exports.findAll = function() {
  return User.forge().fetch();
}

exports.findByID = function(id) {
  return User.forge({ id: id }).fetch();
}

exports.findByFacebookAccount = function(facebook_account) {
  return User.forge({ facebook_account: facebook_account }).fetch();
}

exports.findByTwitterAccount = function(twitter_account) {
  return User.forge({ twitter_account: twitter_account }).fetch();
}

exports.findByGoogleAccount = function(google_account) {
  return User.forge({ google_account: google_account }).fetch();
}

exports.findByEmail = function(email) {
  return User.forge({ email: email }).fetch();
}

exports.findByUsername = function(username) {
  return User.forge({ username: username }).fetch();
}

exports.sendEmail = function(name, email, message) {
  return new Promise(function(resolve, reject) {
    
  });
}