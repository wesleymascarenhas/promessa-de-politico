var politicianService = require('../apis/politicianService');
var promiseService    = require('../apis/promiseService');

module.exports = function(app, passport) {
  
  app.get('/politico/:politicianSlug', function(req, res, next) {
    politicianService.findBySlug(req.params.politicianSlug, ['party', 'organ', 'office', 'coverPhotos'], function(politician) {
      if(politician) {
        promiseService.findAllCategories(function(categories) {
          promiseService.findAllByPolitician(politician, ['category'], function(promises) {
            var promisesByCategory = promiseService.groupPromisesByCategoryId(promises);        
            res.render('politician.html', 
              { 
                politician: politician,
                politicianCoverPhotos: politician.related('coverPhotos').models,
                politicalParty: politician.related('party'),
                politicalOrgan: politician.related('organ'),
                politicalOffice: politician.related('office'),
                promisesByCategory: promisesByCategory,
                categories: categories.models
              }
            );                    
          });
        });
      } else {
        next();
      }
    });
  });

}