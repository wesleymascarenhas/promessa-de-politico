var promiseCategoryService = require('../apis/promiseCategoryService'),
    politicianService      = require('../apis/politicianService'),
    promiseService         = require('../apis/promiseService'),
    viewService            = require('../apis/viewService'),
    helper                 = require('../utils/helper'),
    Promise                = require('bluebird');

module.exports = function(app, passport) {

  var promisesMapper = {
    voteInPolitician: function(user, params) {
      var politician = politicianService.forge({id: params[0]});
      var vote_type = params[1];
      return viewService.voteInPolitician(user, politician, vote_type);
    },
    voteOnPromise: function(user, params) {
      var promise = promiseService.forge({id: params[0]});
      return viewService.voteOnPromise(user, promise);
    },
    getPromises: function(user, params) {
      var politician = politicianService.forge({id: params[0]});
      var category = promiseCategoryService.forge({id: params[1]});
      return viewService.getPromises(user, politician, category);
    },
    getAllPromises: function(user, params) {
      var politician = politicianService.forge({id: params[0]});
      var category = promiseCategoryService.forge({id: params[1]});
      return viewService.getAllPromises(user, politician, category);
    },
    getMajorPromises: function(user, params) {
      var politician = politicianService.forge({id: params[0]});
      var category = promiseCategoryService.forge({id: params[1]});
      return viewService.getAllPromises(user, politician, category);
    },
    getOlderPromises: function(user, params) {
      var politician = politicianService.forge({id: params[0]});
      return viewService.getOlderPromises(user, politician);
    },
    getLatestPromises: function(user, params) {
      var politician = politicianService.forge({id: params[0]});
      return viewService.getLatestPromises(user, politician);
    },
    getAllCategories: function(user, params) {
      return viewService.getAllCategories();
    },
    editPromise: function(user, params) {
      var promiseData = params[0];
      var promiseDataFormatted = {
        id: promiseData.id,
        title: promiseData.title,
        description: promiseData.description,
        evidence_date: promiseData.evidence_date,
        state: promiseData.state,
        category_id: promiseData.category_id,
      };
      var evidencesData = [];
      for(index in promiseData.evidences) {
        var evidence = promiseData.evidences[index];
        if(!evidence.id && evidence.url) {
          evidence.promise_id = promiseDataFormatted.id;
          evidence.registered_by_user_id = user.id;
          evidencesData.push(evidence);
        }
      }      
      var promise = promiseService.forge(promiseDataFormatted);    
      var evidences = promiseService.forgeEvidenceCollection(evidencesData);      
      return viewService.editPromise(promise, evidences);
    }
  }

  app.all('/ajax', function(req, res, next) {
    var user = req.user;

    var key = req.body.key || req.query.key;
    var params = req.body.params || req.query.params;

    var mappedPromise = promisesMapper[key];
    if(mappedPromise) {
      mappedPromise(user, params).then(function(data) {
        res.json({result: 'SUCCESS', data: data});        
      }).catch(function(err) {
        console.log(err);
        if(err instanceof Error) {
          err = err.message;
        }
        res.json({result: 'FAIL', data: err});
      });
    }
  });

}