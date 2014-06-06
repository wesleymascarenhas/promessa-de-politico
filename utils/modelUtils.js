var _ = require('underscore');

var modelsAttributes = {
  User: ['id', 'name', 'gender', 'username', 'email', 'facebook_account', 'twitter_account', 'google_account', 'registration_date'],
  Politician: ['id', 'name', 'nickname', 'biography', 'photo_filename', 'email', 'slug', 'state_id', 'political_party_id', 'political_office_id', 'political_organ_id', 'registered_by_user_id', 'registration_date'],
  Promise: ['id', 'title', 'description', 'slug', 'evidence_date', 'state', 'category_id', 'politician_id', 'registered_by_user_id', 'last_edited_by_user_id', 'registration_date'],
  PromiseEvidence: ['id', 'title', 'description', 'url', 'host', 'image', 'promise_id', 'registered_by_user_id', 'registration_date']
}

var filter = function(data, attributes) {
  var filtered = {};
  attributes.forEach(function(attribute) {
    if(!_.isUndefined(data[attribute])) {
      filtered[attribute] = data[attribute];
    }    
  });
  return filtered;
}

exports.getAttributesMap = function(model, attributes) {
  var map = {};
  attributes.forEach(function(attribute) {
    map[attribute] = model.get(attribute);
  });
  return map;
}

exports.filterAttributes = function(modelName, data) {
  var result = null;
  var attributes = modelsAttributes[modelName];
  if(attributes) {
    if(Array.isArray(data)) {
      result = [];
      data.forEach(function(singleData) {
        result.push(filter(singleData, attributes));
      });
    } else {
      result = filter(data, attributes)
    }
  }
  return result;
}

exports.getIds = function(collection) {
  var ids = [];
  collection.forEach(function(model) {
    ids.push(model.id);
  });
  return ids;
}