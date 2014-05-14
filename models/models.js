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

var PoliticianUserVote = Bookshelf.Model.extend({
  tableName: 'politician_user_vote',
  idAttribute: ['politician_id', 'user_id']
});

var Promise = Bookshelf.Model.extend({
  tableName: 'promise',
  category: function() {
    return this.belongsTo(PromiseCategory, 'category_id');
  },
  politician: function() {
    return this.belongsTo(Politician, 'politician_id');
  },
  registered_by_user: function() {
    return this.belongsTo(User, 'registered_by_user_id');
  },
  evidences: function() {
    return this.hasMany(PromiseEvidence, 'promise_id');
  }
});

var PromiseCategory = Bookshelf.Model.extend({
  tableName: 'promise_category'  
});

var PromiseEvidence = Bookshelf.Model.extend({
  tableName: 'promise_evidence'  
});

var PromiseUserVote = Bookshelf.Model.extend({
  tableName: 'promise_user_vote',
  idAttribute: ['promise_id', 'user_id']
});

var PromiseUserComment = Bookshelf.Model.extend({
  tableName: 'promise_user_comment',
  idAttribute: ['promise_id', 'user_id'] 
});

module.exports = {
  User: User,
  PoliticalParty: PoliticalParty,
  PoliticalOrgan: PoliticalOrgan,
  PoliticalOffice: PoliticalOffice,
  Politician: Politician,
  PoliticianCoverPhoto: PoliticianCoverPhoto,
  PoliticianUserVote: PoliticianUserVote,
  Promise: Promise,
  PromiseCategory: PromiseCategory,
  PromiseEvidence: PromiseEvidence,
  PromiseUserVote: PromiseUserVote,
  PromiseUserComment: PromiseUserComment,
  Bookshelf: Bookshelf
}