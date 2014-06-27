var politicianService      = require('../apis/politicianService'),
    promiseService         = require('../apis/promiseService'),
    viewService            = require('../apis/viewService'),
    helper                 = require('../utils/helper'),
    authorization          = require('../utils/authorization'),
    BluebirdPromise        = require('bluebird');

module.exports = function(app, passport) {

  app.get('/politico/cadastro', authorization.isAuthenticated, function(req, res, next) {
    var user = req.user;
    var data = {};
    data.registeringPolitician = true;
    viewService.getPoliticalAssociations().then(function(politicalAssociationsData) {
      data.politicalParties = politicalAssociationsData.politicalParties;
      data.politicalOffices = politicalAssociationsData.politicalOffices;
      data.states = politicalAssociationsData.state;
      res.render('politician.html', {backendData: data});
    }).catch(function(err) {
      next(err);
    });
  });

  app.get('/politico/:politicianSlug', function(req, res, next) {
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
      data.registeringPolitician = false;
      return BluebirdPromise.all([promiseService.findAllCategories(), promiseService.count(politician), politicianService.countUsersVotes(politician), user ? politicianService.getUserVote(user, politician) : null])
      .spread(function(categories, totalPromises, totalPoliticianUsersVotes, politicianUserVote) {
        data.categories = categories;
        data.totalPromises = totalPromises;
        data.totalPoliticianUsersVotes = totalPoliticianUsersVotes;
        data.politicianUserVote = politicianUserVote;
        if(totalPromises === 0) {
          return data;
        } else {
          return promiseService.countGroupingByState(data.politician)
          .then(function(totalPromisesByState) {
            data.totalPromisesByState = totalPromisesByState;
            return viewService.getLatestPromises(data.user, data.politician, 1, 20).then(function(latestPromisesData) {
              helper.merge(latestPromisesData, data);
              return data;
            });
          });
        }
      });
    }).then(function() {
      if(data.next && data.next === true) {
        next();
      } else {
        res.render('politician.html', {backendData: data});
      }
    }).catch(function(err) {
      next(err);
    });
  });

  app.get('/politicos/:rankType', function(req, res, next) {
    var rankType = req.params.rankType;
    if(rankType === 'cumprindo-promessas' || rankType === 'nao-estao-cumprindo-promessas' || rankType === 'sem-promessas') {
      var data = {};
      data.user = req.user;

      var rankPoliticians = null;
      if(rankType === 'cumprindo-promessas') {
        data.rankType = 'best';
        rankPoliticians = politicianService.bestPoliticians;
      } else if(rankType === 'nao-estao-cumprindo-promessas') {
        data.rankType = 'worst';
        rankPoliticians = politicianService.worstPoliticians;
      } else if(rankType === 'sem-promessas') {
        data.rankType = 'withoutPromises';
        rankPoliticians = politicianService.politiciansWithoutPromises;
      }

      BluebirdPromise.all([rankPoliticians(1, 24), viewService.getPoliticalAssociations()])
      .spread(function(politicians, politicalAssociations) {
        data.politicians = politicians;
        helper.merge(politicalAssociations, data);
        return politicianService.countUsersVotes(data.politicians);
      }).then(function(usersVotesCounts) {
        data.usersVotesCounts = usersVotesCounts;
        if(!data.user) {
          return data;
        } else {
          return politicianService.getUserVotes(data.user, data.politicians)
          .then(function(userVotes) {
            data.userVotes = userVotes;
            return data;
          });
        }
      }).then(function() {
        res.render('politicians_rank.html', {backendData: data});
      }).catch(function(err) {
        console.log(err.stack);
        next(err);
      });
    } else {
      next();
    }
  });
}
