var politicianService = require('../apis/politicianService');
var promiseService    = require('../apis/promiseService');

module.exports = function(app, passport) {
  
  app.get('/promessa/:politicianSlug/:promiseId/:promiseSlug', function(req, res, next) {
    promiseService.findById(req.params.promiseId, ['politician.party', 'politician.organ', 'politician.office', 'category'], function(promise) {
      if(promise) {
        var politician = promise.related('politician');        
        var category = promise.related('category');
        if(req.params.promiseSlug === promise.get('slug') && req.params.politicianSlug === politician.get('slug')) {
          res.render('promise.html', 
            { 
              politician: politician,
              politicalParty: politician.related('party'),
              politicalOrgan: politician.related('organ'),
              politicalOffice: politician.related('office'),
              promise: promise,
              category: category              
            }
          );                    
        } else {
          res.redirect('/promessa/' + politician.get('slug') + '/' + promise.id + '/' + promise.get('slug'));
        }
      } else {
        next();
      }
    });
  });

}