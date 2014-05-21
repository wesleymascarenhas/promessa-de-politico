var politicianService = require('../apis/politicianService'),
    promiseService    = require('../apis/promiseService'),
    viewService       = require('../apis/viewService'),
    BluebirdPromise   = require('bluebird');

module.exports = function(app, passport) {
  
  app.get('/politico/:politicianSlug/nova-promessa', function(req, res, next) {
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
      results.registering = true;
      return BluebirdPromise.all([viewService.fillPolitician(user, results), viewService.getAllCategories()])
      .spread(function(politicianFilled, allCategories) {
        results.categories = allCategories.categories;
        results.category = allCategories.categories.at(0);
        return results;
      });
    }).then(function() {
      if(results.next && results.next === true) {
        next();
      } else {
        res.render('promise.html', {data: results});
      }
    }).catch(function(err) {
      console.log(err.stack)
      next(err);
    });
  });

  app.get('/politico/:politicianSlug/:promiseId/:promiseSlug', function(req, res, next) {
    var user = req.user;
    var results = {};
    promiseService.findById(req.params.promiseId, ['politician', 'politician.party', 'politician.organ', 'politician.office', 'category', 'evidences', 'evidences.registered_by_user', 'registered_by_user'])
    .then(function(promise) {
      if(!promise) {
        results.next = true;
        return results;
      }
      results.user = user;
      results.promise = promise;
      results.politician = promise.related('politician');
      if(req.params.promiseSlug !== promise.get('slug') || req.params.politicianSlug !== results.politician.get('slug')) {
        results.redirect = true;
        return results;
      }
      return viewService.fillPolitician(user, results).then(function() {
        return viewService.fillPromise(user, results).then(function() {
          return results;
        });
      });
    }).then(function() {
      if(results.redirect && results.redirect === true) {
        res.redirect('/politico/' + results.politician.get('slug') + '/' + results.promise.id + '/' + results.promise.get('slug'));
      } else if(results.next && results.next === true) {
        next();
      } else {
        res.render('promise.html', {data: results});
      }
    }).catch(function(err) {
      console.log(err.stack)
      next(err);
    });
  });

}