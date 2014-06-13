var politicianService     = require('../apis/politicianService'),
    viewService           = require('../apis/viewService'),
    helper                = require('../utils/helper'),
    BluebirdPromise       = require('bluebird');

module.exports = function(app) {
	
  app.get('/', function(req, res, next) {
    res.render('land.html');
  });

  app.get('/como-funciona', function(req, res, next) {
    res.render('how-it-works.html');
  });

  app.get('/quem-somos', function(req, res, next) {
    res.render('who-we-are.html');
  });

  app.get('/contato', function(req, res, next) {
    res.render('contact.html');
  });

  app.get('/politicos', function(req, res, next) {
    var data = {};
    data.user = req.user;
    BluebirdPromise.all([politicianService.bestPoliticians(1, 12), politicianService.worstPoliticians(1, 12), viewService.getPoliticalAssociations()])
    .spread(function(bestPoliticians, worstPoliticians, politicalAssociations) {
      data.bestPoliticians =  bestPoliticians;
      data.worstPoliticians = worstPoliticians;
      helper.merge(politicalAssociations, data);
      return [politicianService.countUsersVotes(data.bestPoliticians), politicianService.countUsersVotes(data.worstPoliticians)];
    }).spread(function(usersVotesCountsBestPoliticians, usersVotesCountsWorstPoliticians) {
      data.usersVotesCounts = {};
      helper.merge(usersVotesCountsBestPoliticians, data.usersVotesCounts);
      helper.merge(usersVotesCountsWorstPoliticians, data.usersVotesCounts);
      if(!data.user) {
        return data;
      } else {
        return BluebirdPromise.all([politicianService.getUserVotes(data.user, data.bestPoliticians), politicianService.getUserVotes(data.user, data.worstPoliticians)])
          .spread(function(userVotesBestPoliticians, userVotesWorstPoliticians) {
            data.userVotes = {};
            helper.merge(userVotesBestPoliticians, data.userVotes);
            helper.merge(userVotesWorstPoliticians, data.userVotes);
            return data;
          });
      }
    }).then(function() { 
      console.log(data);
      res.render('index.html', {backendData: data});
    }).catch(function(err) {
      console.log(err.stack);
      next(err);
    });
  });

}