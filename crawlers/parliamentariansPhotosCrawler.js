var politicianService = require('../apis/politicianService'),
    Politician        = require('../models/models').Politician,
    User              = require('../models/models').User,
    fileUtils         = require('../utils/fileUtils'),
    Promise           = require('bluebird'),
    _                 = require('underscore'),
    _str              = require('underscore.string');

_.mixin(_str.exports());

politicianService.findAll().then(function(politicians) {
  var user = User.forge({id: 1});
  var politiciansToDownload = [];
  politicians.forEach(function(politician) {
    if(_.startsWith(politician.get('photo_filename'), 'http')) {
      politiciansToDownload.push(politician);      
    }
  });
  var politiciansToDownloadPromises = [];
  politiciansToDownload.forEach(function(politicianToDownload) {
    politiciansToDownloadPromises.push(
      new Promise(function(resolve, reject) {
        fileUtils.downloadPoliticianPhoto(politicianToDownload.get('photo_filename'), politicianToDownload, fileUtils.extensions.image).then(function(politician) {
          politicianService.update(politician).then(function(politician) {
            resolve(politician);              
          });  
        }).catch(function(err) {
          console.log('Error downloading politician ' + politicianToDownload.id + ' photo: ' + err.message);
          resolve(politicianToDownload);
        });
      })
    );
  });

  Promise.all(politiciansToDownloadPromises).delay(10000).then(function() {
    console.log(politicians.size() + ' politicians photos downloaded');
    process.exit(1);
  }).catch(function(err) {
    process.exit(1);  
  });
});



