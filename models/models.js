var settings  = require('../configs/settings'),
    Bookshelf = require('bookshelf');
    
var Database = Bookshelf.initialize({
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

var User = Database.Model.extend({
  tableName: 'user'  
});

var PoliticalParty = Database.Model.extend({
  tableName: 'political_party',
  id: 'id'
});

var PoliticalOrgan = Database.Model.extend({
  tableName: 'political_organ'  
});

var PoliticalOffice = Database.Model.extend({
  tableName: 'political_office'
});

var PoliticianCoverPhoto = Database.Model.extend({
  tableName: 'politician_cover_photo'
});

var Politician = Database.Model.extend({
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

var PromiseCategory = Database.Model.extend({
  tableName: 'promise_category'  
});

var Promise = Database.Model.extend({
  tableName: 'promise',
  category: function() {
    return this.belongsTo(PromiseCategory, 'category_id');
  },
  politician: function() {
    return this.belongsTo(Politician, 'politician_id');
  }
});

module.exports.User = User;
module.exports.PoliticalParty = PoliticalParty;
module.exports.Politician = Politician;
module.exports.Promise = Promise;
module.exports.PromiseCategory = PromiseCategory;