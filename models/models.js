var settings  = require('../configs/settings'),
    Bookshelf = require('bookshelf').initialize({
      client: settings.databaseDialect,
      debug: true,
      connection: {
        host: settings.databaseHost,
        user: settings.databaseUser,
        password: settings.databasePassword,
        database: settings.databaseSchema,
        charset: settings.databaseCharset
      }
    });

var User = Bookshelf.Model.extend({
  tableName: 'user'  
});

var PoliticalParty = Bookshelf.Model.extend({
  tableName: 'political_party',
  id: 'id'
});

var PoliticalOrgan = Bookshelf.Model.extend({
  tableName: 'political_organ'  
});

var PoliticalOffice = Bookshelf.Model.extend({
  tableName: 'political_office'
});

var Politician = Bookshelf.Model.extend({
  tableName: 'politician',
  party: function() {
    return this.belongsTo(PoliticalParty, 'political_party_id');
  },
  office: function() {
    return this.belongsTo(PoliticalOffice, 'political_office_id');
  },
  organ: function() {
    return this.belongsTo(PoliticalOrgan, 'political_organ_id');
  },
  coverPhotos: function() {
    return this.hasMany(PoliticianCoverPhoto, 'politician_id');
  }
});

var PoliticianCoverPhoto = Bookshelf.Model.extend({
  tableName: 'politician_cover_photo'
});

var PoliticianVote = Bookshelf.Model.extend({
  tableName: 'politician_vote'  
});

var Promise = Bookshelf.Model.extend({
  tableName: 'promise',
  category: function() {
    return this.belongsTo(PromiseCategory, 'category_id');
  },
  politician: function() {
    return this.belongsTo(Politician, 'politician_id');
  }
});

var PromiseCategory = Bookshelf.Model.extend({
  tableName: 'promise_category'  
});

var PromiseEvidence = Bookshelf.Model.extend({
  tableName: 'promise_evidence'  
});

var PromisePriorityVote = Bookshelf.Model.extend({
  tableName: 'promise_priority_vote'  
});

module.exports.User = User;
module.exports.PoliticalParty = PoliticalParty;
module.exports.PoliticalOrgan = PoliticalOrgan;
module.exports.PoliticalOffice = PoliticalOffice;
module.exports.Politician = Politician;
module.exports.PoliticianCoverPhoto = PoliticianCoverPhoto;
module.exports.PoliticianVote = PoliticianVote;
module.exports.Promise = Promise;
module.exports.PromiseCategory = PromiseCategory;
module.exports.PromiseEvidence = PromiseEvidence;
module.exports.PromisePriorityVote = PromisePriorityVote;
module.exports.Bookshelf = Bookshelf;