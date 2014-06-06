var request = require('request'),
    mime    = require('mime'),
    path    = require('path'),
    fs      = require('fs'),
    _       = require('underscore');

exports.userPhotoFilename = function(user) {
  return user.id + '_' + new Date().getTime();
}

exports.userPhotoFilePath = function(obj) {
  return path.join(path.dirname(process.mainModule.filename), 'public/img/users/', _.isString(obj) ? obj : userPhotoFilename(obj));
}

exports.downloadUserPhoto = function(uri, user, callback) {  
  var photoFilename = this.userPhotoFilename(user);
  var photoPath = this.userPhotoFilePath(photoFilename);
  this.download(uri, photoPath, function(err) {
    if(!err) {
      user.set('photo_filename', photoFilename);      
      callback()
    } else {
      callback(err);
    }
  });
}

exports.politicianPhotoFilename = function(politician) {
  return politician.id + '_' + new Date().getTime();
}

exports.politicianPhotoFilePath = function(obj) {
  return path.join(path.dirname(process.mainModule.filename), 'public/img/politicians/', _.isString(obj) ? obj : politicianPhotoFilename(obj));
}

exports.downloadPoliticianPhoto = function(uri, politician, callback) {  
  var photoFilename = this.politicianPhotoFilename(politician);
  var photoPath = this.politicianPhotoFilePath(photoFilename);
  this.download(uri, photoPath, function(err) {
    if(!err) {
      user.set('photo_filename', photoFilename);      
      callback()
    } else {
      callback(err);
    }
  });
}

exports.download = function(uri, filename, callback) { 
  request.head(uri, function(err, res, body) {
    if(err) {
      callback(err);
    } else {
      var extension = mime.extension(res.headers['content-type']);
      var pipe = request(uri).pipe(fs.createWriteStream(filename + "." + extension));
      pipe.on('close', callback);      
    }
  });
}