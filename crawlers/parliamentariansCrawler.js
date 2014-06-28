var politicianService = require('../apis/politicianService'),
    Politician        = require('../models/models').Politician,
    User              = require('../models/models').User,
    Promise           = require('bluebird'),
    _                 = require('underscore'),
    fileUtils         = require('../utils/fileUtils'),
    parliamentarians  = require('../scripts/parliamentarian.json');

_.mixin({
  capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
  }
});

function capitalized(str) {
  var cap = '';
  str.split(' ').forEach(function(split) {
    split = split.toLowerCase();
    if(split !== 'de' && split !== 'da' && split !== 'do') {
      split = _.capitalize(split);
    }
    cap += split + ' ';
  });
  cap = cap.trim();
  return cap;
}

Promise.all([politicianService.allPoliticalParties(), politicianService.allPoliticalOffices(), politicianService.allStates()])
.spread(function(politicalParties, politicalOffices, states) {
  politicalParties = _.indexBy(politicalParties.toJSON(), 'acronym');
  politicalOffices = _.indexBy(politicalOffices.toJSON(), 'title');
  states = _.indexBy(states.toJSON(), 'uf');

  var politicians = Politician.collection();
  parliamentarians.response.docs.forEach(function(parliamentarian) {
    if(parliamentarian.tratamento.trim() === 'Deputada') {
      parliamentarian.tratamento = 'Deputado';
    }
    if(parliamentarian.tratamento.trim() === 'Senadora') {
      parliamentarian.tratamento = 'Senador';
    }
    var politicalParty = politicalParties[parliamentarian.partido.trim()];
    var politicalOffice = politicalOffices[parliamentarian.tratamento.trim()];
    var state = states[parliamentarian.uf.trim().toUpperCase()];
    var email = parliamentarian.email.trim();
    var picture = parliamentarian.foto;

    var name = capitalized(parliamentarian.nomecompleto);
    var nickname = capitalized(parliamentarian.nome);

    politicians.add({photo_filename: picture, name: name, nickname: nickname, email: email, political_party_id: politicalParty.id, political_office_id: politicalOffice.id, state_id: state.id});
  });

  var user = User.forge({id: 1});
  var promises = [];
  politicians.forEach(function(politician) {
    promises.push(politicianService.register(user, politician));
  });

  Promise.all(promises).then(function() {
    console.log(politicians.size() + ' politicians saved');
    var downloadPromises = [];
    politicians.forEach(function(politician) {
      downloadPromises.push(
        new Promise(function(resolve, reject) {
          fileUtils.downloadPoliticianPhoto(politician.get('photo_filename'), politician, fileUtils.extensions.image).then(function(politician) {
            politicianService.update(user, politician).then(function(politician) {
              resolve(politician);
            });
          }).catch(function(err) {
            console.log('Error downloading politician ' + politician.id + ' photo: ' + err.message);
            resolve(politician);
          });
        })
      );
    });
    Promise.all(downloadPromises).then(function() {
      console.log(politicians.size() + ' politicians photos downloaded');
      process.exit(1);
    })
  }).catch(function(err) {
    console.log('Error saving ' + politicians.size() + ' politicians: ' + err.message);
    process.exit(1);
  });
});