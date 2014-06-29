var User           = require('../models/models').User,
    modelUtils     = require('../utils/modelUtils'),
    helper         = require('../utils/helper'),
    Promise        = require('bluebird'),
    _              = require('underscore');

function createUser(attributes) {
  var user = User.forge(modelUtils.filterAttributes('User', attributes));
  if(!user.get('username')) {
    var username;
    if(user.get('email')) {
      username = user.get('email').split('@')[0];
    } else {
      username = helper.slugify(user.get('name'));
    }
    user.set('username', username);
  }
  return user.saver();
}

exports.createByFacebookAccount = function(name, gender, username, email, facebook_account) {
  return this.createUser({ name: name, gender: gender, username: username, email: email, facebook_account: facebook_account });
}

exports.createByTwitterAccount = function(name, gender, username, email, twitter_account) {
  return this.createUser({ name: name, gender: gender, username: username, email: email, twitter_account: twitter_account });
}

exports.createByGoogleAccount = function(name, gender, username, email, google_account) {
  return this.createUser({ name: name, gender: gender, username: username, email: email, google_account: google_account });
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