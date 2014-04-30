var User  = require('../models/models').User;

exports.create = function(name, username, email, gender, facebookID, callback) {
	User.forge({ name: name, username: username, email: email, gender: gender, facebook_id: facebookID })
			.save().then(function(err, model) {
				callback(err, model);
			});
}

exports.update = function(userData, callback) {
	User.forge(userData).save().then(function(err, model) { 
		callback(err, model);	
	});
}

exports.findAll = function(callback) {
	User.forge().fetch().then(function(model) {
		callback(err, model);
	});
}

exports.findByID = function(id, callback) {
	User.forge({ id: id }).fetch().then(function(err, model) {
		callback(err, model);
	});
}

exports.findByFacebookID = function(facebookID, callback) {
	User.forge({ facebook_id: facebookID }).fetch().then(function(err, model) {
		callback(err, model);
	});
}

exports.findByEmail = function(email, callback) {
	User.forge({ email: email }).fetch().then(function(err, model) {
		callback(err, model);
	});
}

exports.findByUsername = function(username, callback) {
	User.forge({ username: username }).fetch().then(function(err, model) {
		callback(err, model);
	});
}