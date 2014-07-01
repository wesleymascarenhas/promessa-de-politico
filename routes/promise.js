var politicianService = require('../apis/politicianService'),
    promiseService    = require('../apis/promiseService'),
    viewService       = require('../apis/viewService'),
    authorization     = require('../utils/authorization'),
    BluebirdPromise   = require('bluebird');

module.exports = function(app, passport) {

  app.get('/politico/:politicianSlug/nova-promessa', authorization.isAuthenticated, function(req, res, next) {
    var user = req.user;
    var slug = req.params.politicianSlug;
    var data = {};
    politicianService.findBySlug(slug, ['party', 'office', 'state'])
    .then(function(politician) {
      if(!politician) {
        data.next = true;
        return data;
      }
      data.user = user;
      data.politician = politician;
      data.registeringPromise = true;
      return BluebirdPromise.all([viewService.fillPolitician(user, data), viewService.getAllCategories()])
      .spread(function(politicianFilled, allCategories) {
        data.categories = allCategories.categories;
        data.category = allCategories.categories.at(0);
        return data;
      });
    }).then(function() {
      if(data.next && data.next === true) {
        next();
      } else {
        res.render('promise.html', {backendData: data});
      }
    }).catch(function(err) {
      console.log(err.stack)
      next(err);
    });
  });

  app.get('/politico/:politicianSlug/:promiseId/:promiseSlug', function(req, res, next) {
    var user = req.user;
    var data = {};
    promiseService.findById(req.params.promiseId, ['politician', 'politician.party', 'politician.office', 'politician.state', 'category', 'evidences', 'evidences.registeredByUser', 'registeredByUser'])
    .then(function(promise) {
      if(!promise) {
        data.next = true;
        return data;
      }
      data.user = user;
      data.promise = promise;
      data.politician = promise.related('politician');
      data.registeringPromise = false;
      if(req.params.promiseSlug !== promise.get('slug') || req.params.politicianSlug !== data.politician.get('slug')) {
        data.redirect = true;
        return data;
      }
      return viewService.fillPolitician(user, data).then(function() {
        return viewService.fillPromiseWithUsersComments(user, data).then(function() {
          return data;
        });
      });
    }).then(function() {
      if(data.redirect && data.redirect === true) {
        res.redirect('/politico/' + data.politician.get('slug') + '/' + data.promise.id + '/' + data.promise.get('slug'));
      } else if(data.next && data.next === true) {
        next();
      } else {
        res.render('promise.html', {backendData: data});
      }
    }).catch(function(err) {
      console.log(err.stack)
      next(err);
    });
  });

}