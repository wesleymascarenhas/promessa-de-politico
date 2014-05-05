var promiseCategoryService = require('../apis/promiseCategoryService'),
    politicianService      = require('../apis/politicianService'),
    promiseService         = require('../apis/promiseService'),
    helper                 = require('../utils/helper');

module.exports = function(app, passport) {
  
  app.get('/politico/:politicianSlug', function(req, res, next) {
    var user = req.user;
    var slug = req.params.politicianSlug;
    politicianService.findBySlug(slug, ['party', 'organ', 'office', 'coverPhotos']).bind({})    
    .then(function(politician) {
      if(!politician) {
        throw new Error("Politician with slug " + slug + " was no found");
      }
      this.politician = politician;
      return fillPoliticianPage(user, this);   
    }).then(function() {          
      this.politicianCoverPhotos = this.politician.related('coverPhotos'),
      this.politicalParty = this.politician.related('party'),
      this.politicalOrgan = this.politician.related('organ'),
      this.politicalOffice = this.politician.related('office'),
      res.render('politician.html', this);
    }).catch(function(err) {
      next(err);
    });    
  });

  function fillPoliticianPage(user, result) {
    return promiseService.count(result.politician)
    .then(function(promisesCount) {        
      result.promisesCount = promisesCount;
      if(result.promisesCount > 0) {             
        return promiseCategoryService.findByPolitician(result.politician)
        .then(function(categories) {
          result.categories = categories;
          return promiseService.countGroupingByState(result.politician)
          .then(function(promisesCountsByState) {              
            result.promisesCountsByState = promisesCountsByState;
            result.promisesFulfilledPercentage = result.promisesCountsByState['FULFILLED'] * result.promisesCount / 100;
            result.category = result.categories.at(helper.randomIndex(result.categories));
            return promiseService.findAllByPoliticianAndCategory(result.politician, result.category, [])
            .then(function(promises) {
              result.promises = promises;
              if(user) {
                return promiseService.findPriorityVotes(user, result.promises)
                .then(function(promisesVotes) {                
                  result.promisesVotes = promisesVotes;
                });
              }
            });
          });
        });  
      }
    });
  }
}