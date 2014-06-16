var politicianService     = require('../apis/politicianService'),
    viewService           = require('../apis/viewService'),
    helper                = require('../utils/helper'),
    BluebirdPromise       = require('bluebird');

module.exports = function(app) {
	
  app.get('/', function(req, res, next) {
    res.render('land.html');
  });

  app.get('/como-funciona', function(req, res, next) {
    res.render('how-it-works.html', {backendData: {howItWorksActive: true}});
  });

  app.get('/quem-somos', function(req, res, next) {
    res.render('who-we-are.html', {backendData: {whoWeAreActive: true}});
  });

  app.get('/contato', function(req, res, next) {
    res.render('contact.html', {backendData: {contactActive: true}});
  });

  app.get('/politicos', function(req, res, next) {
    var data = {};
    data.user = req.user;
    BluebirdPromise.all([politicianService.bestPoliticians(1, 12), politicianService.worstPoliticians(1, 12), politicianService.politiciansWithoutPromises(1, 12), viewService.getPoliticalAssociations()])
    .spread(function(bestPoliticians, worstPoliticians, politiciansWithoutPromises, politicalAssociations) {
      data.bestPoliticians =  bestPoliticians;
      data.worstPoliticians = worstPoliticians;
      data.politiciansWithoutPromises = politiciansWithoutPromises;
      helper.merge(politicalAssociations, data);
      return [politicianService.countUsersVotes(data.bestPoliticians), politicianService.countUsersVotes(data.worstPoliticians), politicianService.countUsersVotes(data.politiciansWithoutPromises)];
    }).spread(function(usersVotesCountsBestPoliticians, usersVotesCountsWorstPoliticians, usersVotesCountsPoliticiansWithoutPromises) {
      data.usersVotesCounts = {};
      helper.merge(usersVotesCountsBestPoliticians, data.usersVotesCounts);
      helper.merge(usersVotesCountsWorstPoliticians, data.usersVotesCounts);
      helper.merge(usersVotesCountsPoliticiansWithoutPromises, data.usersVotesCounts);
      if(!data.user) {
        return data;
      } else {
        return BluebirdPromise.all([politicianService.getUserVotes(data.user, data.bestPoliticians), politicianService.getUserVotes(data.user, data.worstPoliticians), politicianService.getUserVotes(data.user, data.politiciansWithoutPromises)])
        .spread(function(userVotesBestPoliticians, userVotesWorstPoliticians, userVotesPoliticiansWithoutPromises) {
          data.userVotes = {};
          helper.merge(userVotesBestPoliticians, data.userVotes);
          helper.merge(userVotesWorstPoliticians, data.userVotes);
          helper.merge(userVotesPoliticiansWithoutPromises, data.userVotes);
          return data;
        });
      }
    }).then(function() { 
      res.render('index.html', {backendData: data});
    }).catch(function(err) {
      console.log(err.stack);
      next(err);
    });
  });

}