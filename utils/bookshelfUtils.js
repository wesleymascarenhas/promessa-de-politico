var _ = require('underscore');

exports.getAttributesMap = function(model, attributes) {
  var map = {};
  _.each(attributes, function(attribute) {
    map[attribute] = model.get(attribute);
  });
  return map;
}

exports.getIds = function(collection) {
  var ids = [];
  collection.forEach(function(model) {
    ids.push(model.id);
  });
  return ids;
}