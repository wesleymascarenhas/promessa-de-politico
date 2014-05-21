var politicianService      = require('../apis/politicianService'),
    promiseService         = require('../apis/promiseService'),
    promiseCategoryService = require('../apis/promiseCategoryService'),
    viewService            = require('../apis/viewService'),
    BluebirdPromise        = require('bluebird'),
    helper                 = require('../utils/helper');

module.exports = function(app, passport) {

  app.get('/index.html', function(req, res, next) {
    res.render('index.html');
  });

  app.get('/politico/:politicianSlug', function(req, res, next) {
    var user = req.user;
    var slug = req.params.politicianSlug;
    var results = {};
    politicianService.findBySlug(slug, ['party', 'organ', 'office', 'coverPhotos'])
    .then(function(politician) {
      if(!politician) {
        results.next = true;
        return results;
      } 
      results.user = user;
      results.politician = politician;
      return BluebirdPromise.all([promiseCategoryService.findAll(), promiseService.count(politician), politicianService.countUsersVotes(politician), user ? politicianService.getUserVote(user, politician) : null])
      .spread(function(categories, totalPromises, totalPoliticianUsersVotes, politicianUserVote) {   
        results.categories = categories;
        results.totalPromises = totalPromises;
        results.totalPoliticianUsersVotes = totalPoliticianUsersVotes;
        results.politicianUserVote = politicianUserVote;
        if(totalPromises === 0) {
          return results;
        } else {
          return promiseService.countGroupingByState(results.politician)
          .then(function(totalPromisesByState) {
            results.totalPromisesByState = totalPromisesByState;            
            return viewService.getLatestPromises(results.user, results.politician, 1, 20).then(function(vars) {
              helper.merge(vars, results);
              return results;
            });               
          });
        }
      });     
    }).then(function() {      
      if(results.next && results.next === true) {
        next();
      } else {
        res.render("politician.html", {data: results});
      }
    }).catch(function(err) {
      next(err);
    });    
  });

}
