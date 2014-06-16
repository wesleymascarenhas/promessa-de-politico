var promiseCategoryService = require('../apis/promiseCategoryService'),
    politicianService      = require('../apis/politicianService'),
    promiseService         = require('../apis/promiseService'),
    oembedService          = require('../apis/oembedService'),
    viewService            = require('../apis/viewService'),
    helper                 = require('../utils/helper'),
    apiErrors              = require('../apis/errors/apiErrors'),
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
        var pageSize = params[2];
        return viewService.getMajorPromises(user, politician, page, pageSize);
      }
    },
    getOlderPromises: {
      auth: false,
        action: function(user, params) {
        var politician = politicianService.forge({id: params[0]});
        var page = params[1];
        var pageSize = params[2];
        return viewService.getOlderPromises(user, politician, page, pageSize);
      }
    },
    getLatestPromises: {
      auth: false,
      action: function(user, params) {
        var politician = politicianService.forge({id: params[0]});
        var page = params[1];
        var pageSize = params[2];
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
        var evidencesData = params[1];      

        var promise = promiseService.forge(promiseData);    
        var evidences = promiseService.forgeEvidenceCollection(evidencesData);      
        return viewService.editPromise(user, promise, evidences);
      }
    },
    registerPromise: {
      auth: true,
      action: function(user, params) {
        var politician_id = params[0];
        var promiseData = params[1];
        var evidencesData = params[2];
              
        var politician = politicianService.forge({id: politician_id});
        var promise = promiseService.forge(promiseData);    
        var evidences = promiseService.forgeEvidenceCollection(evidencesData);      
        return viewService.registerPromise(user, politician, promise, evidences);        
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
    },
    updatePolitician: {
      auth: true,
      action: function(user, params) {
        var politician = politicianService.forge(params[0]);
        return politicianService.update(politician);
      }
    },
    registerPolitician: {
      auth: true,
      action: function(user, params) {        
        var politician = politicianService.forge(params[0]);
        return politicianService.register(user, politician);
      }
    },
    findPolitician: {
      auth: false,
      action: function(user, params) {
        var politician_id = params[0];
        var related = params[1];
        return politicianService.findById(politician_id, related);
      }
    },
    getPoliticalAssociations: {
      auth: false,
      action: function(user, params) {
        return viewService.getPoliticalAssociations();
      }
    },
    commentPromise: {
      auth: true,
      action: function(user, params) {
        var promise = promiseService.forge({id: params[0]});
        var comment = params[1];
        return viewService.commentPromise(user, promise, comment);
      }
    },
    removeComment: {
      auth: true,
      action: function(user, params) {
        var comment_id = params[0];
        return promiseService.removeComment(comment_id);
      }
    },    
    searchPoliticians: {
      auth: false,
      action: function(user, params) {
        var value = params[0];
        var columns = params[1];       
        return politicianService.search(value, columns);
      }
    },
    filterPoliticians: {
      auth: false,
      action: function(user, params) {
        var page = params[0];
        var pageSize = params[1];
        var politicalParty = params[2] ? politicianService.forgePoliticalParty({id: params[2]}) : null;
        var state = params[3] ? politicianService.forgeState({id: params[3]}) : null;
        return viewService.filterPoliticians(page, pageSize, politicalParty, state);
      }
    },
    bestPoliticians: {
      auth: false,
      action: function(user, params) {
        var page = params[0];
        var pageSize = params[1];
        var politicalParty = params[2] ? politicianService.forgePoliticalParty({id: params[2]}) : null;
        var state = params[3] ? politicianService.forgeState({id: params[3]}) : null;
        return politicianService.bestPoliticians(page, pageSize, politicalParty, state); 
      }
    },
    worstPoliticians: {
      auth: false,
      action: function(user, params) {
        var page = params[0];
        var pageSize = params[1];
        var politicalParty = params[2] ? politicianService.forgePoliticalParty({id: params[2]}) : null;
        var state = params[3] ? politicianService.forgeState({id: params[3]}) : null;
        return politicianService.worstPoliticians(page, pageSize, politicalParty, state); 
      }
    },
    politiciansWithoutPromises: {
      auth: false,
      action: function(user, params) {
        var page = params[0];
        var pageSize = params[1];
        var politicalParty = params[2] ? politicianService.forgePoliticalParty({id: params[2]}) : null;
        var state = params[3] ? politicianService.forgeState({id: params[3]}) : null;
        return politicianService.politiciansWithoutPromises(page, pageSize, politicalParty, state);  
      }
    },
    sendEmail: {
      auth: false,
      action: function(user, params) {
        var name = params[0];
        var email = params[1];
        var message = params[2];
        return userService.sendEmail(name, email, message);
      }
    }
  }

  app.all('/ajax', function(req, res, next) {
    var user = req.user;

    var key = req.body.key || req.query.key;
    var params = req.body.params || req.query.params;

    try {
    var mappedPromise = promisesMapper[key];
    if(!mappedPromise) {
      res.status(404).send('Not found')
    } else {
      if(mappedPromise.auth === true && !req.isAuthenticated()) {
        res.status(401).send('Authentication required');
      } else {
        mappedPromise.action(user, params).then(function(data) {
          res.json({data: data});        
        }).catch(function(err) {
          if(err instanceof apiErrors.GenericError) {
            res.json(err.statusCode, err.toJSON());
          } else {
            res.json(500, {statusCode: 500, key: 'internalError'});
          }
        });
      }
    }
    } catch(err) {
      console.log(err.stack)
    };
  });

}