var promiseCategoryService = require('../apis/promiseCategoryService'),
    politicianService      = require('../apis/politicianService'),
    promiseService         = require('../apis/promiseService'),
    viewService            = require('../apis/viewService'),
    helper                 = require('../utils/helper'),
    Promise                = require('bluebird');

module.exports = function(app, passport) {

  app.get('/politico/:politicianId/categoria/:categoryId/promessas', function(req, res, next) {
    var user = req.user;
    var politician = politicianService.forge({id: req.params.politicianId});
    var category = promiseCategoryService.forge({id: req.params.categoryId});

    var results = {politician: politician, category: category};
    viewService.loadPromises(politician, category, user, results)
    .then(function() {
      if(results.next && results.next === true) {
        next();
      } else {
        res.json(results);
      }
    }).catch(function(err) {
      console.log(err.stack);
      next(err);
    });
  });

  app.get('/politico/:politicianSlug', function(req, res, next) {
    var user = req.user;
    var slug = req.params.politicianSlug;
    var results = {};
    politicianService.findBySlug(slug, ['party', 'organ', 'office', 'coverPhotos'])
    .then(function(politician) {
      if(!politician) {
        results.next = true;
      } else {
        results.politician = politician;
        return promiseService.count(politician)
        .then(function(totalPromises) {   
          results.totalPromises = totalPromises;
          if(totalPromises > 0) {
            return Promise.all([promiseCategoryService.findByPolitician(results.politician), promiseService.countGroupingByState(results.politician), promiseService.countGroupingByCategory(results.politician)])
            .spread(function(categories, totalPromisesByState, totalPromisesByCategory) {
              results.categories = categories;
              results.category = categories.at(helper.randomIndex(categories));    
              results.totalPromisesByCategory = totalPromisesByCategory;          
              results.totalPromisesByState = totalPromisesByState;
              results.promisesFulfilledPercentage = results.totalPromisesByState['FULFILLED'] * results.totalPromises / 100;
              return viewService.loadPromises(results.politician, results.category, user, results);
            });
          }
        });
      }
    }).then(function() {
      if(results.next && results.next === true) {
        next();
      } else {
        res.render("politician.html", {data: results});
      }
    }).catch(function(err) {
      console.log(err.stack);
      next(err);
    });    
  });

}
