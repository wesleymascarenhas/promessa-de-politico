var promiseCategoryService = require('../apis/promiseCategoryService'),
    politicianService      = require('../apis/politicianService'),
    promiseService         = require('../apis/promiseService'),
    oembedService          = require('../apis/oembedService'),
    viewService            = require('../apis/viewService'),
    helper                 = require('../utils/helper'),
    Promise                = require('bluebird');

module.exports = function(app, passport) {

  var promisesMapper = {
    getAuthenticatedUser: {
      auth: false,
      action: function(user, params) {
        return new Promise(function(resolve, reject) {
          resolve({user: user});
        });
      }
    },
    voteInPolitician: {
      auth: true,
      action: function(user, params) {
        var politician = politicianService.forge({id: params[0]});
        var vote_type = params[1];
        return viewService.voteInPolitician(user, politician, vote_type);
      }
    },
    voteOnPromise: {
      auth: true,
        action: function(user, params) {
        var promise = promiseService.forge({id: params[0]});
        return viewService.voteOnPromise(user, promise);
      }
    },
    getPromises: {
      auth: false,
      action: function(user, params) {
        var politician = politicianService.forge({id: params[0]});
        var category = promiseCategoryService.forge({id: params[1]});
        return viewService.getPromises(user, politician, category);
      }
    },
    getAllPromises: {
      auth: false,
      action: function(user, params) {
        var politician = politicianService.forge({id: params[0]});
        var category = promiseCategoryService.forge({id: params[1]});
        return viewService.getAllPromises(user, politician, category);
      }
    },
    getMajorPromises: {
      auth: false,
      action: function(user, params) {
        var politician = politicianService.forge({id: params[0]});
        var page = params[1];
        var pageSize = 20;
        return viewService.getMajorPromises(user, politician, page, pageSize);
      }
    },
    getOlderPromises: {
      auth: false,
        action: function(user, params) {
        var politician = politicianService.forge({id: params[0]});
        var page = params[1];
        var pageSize = 20;
        return viewService.getOlderPromises(user, politician, page, pageSize);
      }
    },
    getLatestPromises: {
      auth: false,
      action: function(user, params) {
        var politician = politicianService.forge({id: params[0]});
        var page = params[1];
        var pageSize = 20;
        return viewService.getLatestPromises(user, politician, page, pageSize);
      }
    },
    getAllCategories: {
      auth: false,
      action: function(user, params) {
        return viewService.getAllCategories();
      }
    },
    editPromise: {
      auth: true,
      action: function(user, params) {
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
            evidencesData.push(evidence);
          }
        }      
        var promise = promiseService.forge(promiseDataFormatted);    
        var evidences = promiseService.forgeEvidenceCollection(evidencesData);      
        return viewService.editPromise(user, promise, evidences);
      }
    },
    registerPromise: {
      auth: true,
      action: function(user, params) {
        var promiseData = params[0];
        var promiseDataFormatted = {
          title: promiseData.title,
          description: promiseData.description,
          evidence_date: promiseData.evidence_date,
          state: promiseData.state,
          category_id: promiseData.category_id,
          politician_id: promiseData.politician_id,
        };
        var evidencesData = [];
        for(index in promiseData.evidences) {
          var evidence = promiseData.evidences[index];
          if(!evidence.id && evidence.url) {            
            evidencesData.push(evidence);
          }
        }      
        var promise = promiseService.forge(promiseDataFormatted);    
        var evidences = promiseService.forgeEvidenceCollection(evidencesData);      
        return viewService.registerPromise(user, promise, evidences);        
      }
    },
    getOEmbed: {
      auth: true,
      action: function(user, params) {
        var url = params[0];
        return oembedService.getOEmbed(url);
      }
    },
    removeEvidence: {
      auth: true,
      action: function(user, params) {
        var evidence = promiseService.forgeEvidence(params[0]);
        return promiseService.removeEvidence(user, evidence);
      }
    }
  }

  app.all('/ajax', function(req, res, next) {
    var user = req.user;

    var key = req.body.key || req.query.key;
    var params = req.body.params || req.query.params;

    var mappedPromise = promisesMapper[key];
    if(mappedPromise) {
      if(mappedPromise.auth === true && !req.isAuthenticated()) {
        res.status(401).send("Authentication required");
      } else {
        mappedPromise.action(user, params).then(function(data) {
          res.json({data: data});        
        }).catch(function(err) {
          console.log(err.stack)
          res.status(500).send("Internal error");
        });
      }
    }
  });

}