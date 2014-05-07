


var promiseCategoryService = require('../apis/promiseCategoryService'),
    politicianService      = require('../apis/politicianService'),
    promiseService         = require('../apis/promiseService'),
    helper                 = require('../utils/helper'),
    Promise                = require('bluebird');

module.exports = function(app, passport) {  
  app.get('/politico/:politicianSlug', function(req, res, next) {
    var user = req.user;
    var slug = req.params.politicianSlug;
    politicianService.findBySlug(slug, ['party', 'organ', 'office', 'coverPhotos']).bind({})    
    .then(function(politician) {
      if(!politician) {
        this.nextWithError = false;
        return Promise.reject('Politician with slug ' + slug + ' was not found');      
      }
      this.politician = politician;
      this.politicalParty = politician.related('party');
      this.politicalOrgan = politician.related('organ');
      this.politicalOffice = politician.related('office');
      this.politicianCoverPhotos = politician.related('coverPhotos');
      return promiseService.count(politician);
    }).then(function(promisesCount) {   
      this.promisesCount = promisesCount;
      if(promisesCount === 0) {
        this.continueWithRender = true;
        return Promise.reject('Politician has no promises');
      }
      return promiseCategoryService.findByPolitician(this.politician);
    }).then(function(categories) {      
      this.categories = categories;
      this.category = categories.at(helper.randomIndex(categories));
      return promiseService.countGroupingByState(this.politician);
    }).then(function(promisesCountsByState) {              
      this.promisesCountsByState = promisesCountsByState;
      this.promisesFulfilledPercentage = this.promisesCountsByState['FULFILLED'] * this.promisesCount / 100;
      return promiseService.findAllByPoliticianAndCategory(this.politician, this.category, []);
    }).then(function(promises) {
      this.promises = promises;
      if(!user) {
        this.continueWithRender = true;
        return Promise.reject('Can\'t get user votes because he is not logged in');
      }
      return promiseService.findPriorityVotes(user, promises);
    }).then(function(promisesVotes) {
      this.promisesVotes = promisesVotes;
      return Promise.resolved();
    }).then(function() {
      res.render('politician.html', this);      
    }).catch(function(err) {
      if(this.continueWithRender && this.continueWithRender === true) {
        res.render('politician.html', this);      
      } else if(this.nextWithError && this.nextWithError === true) {
        next(err);
      } else {
        next();
      }
    });    
  });
}