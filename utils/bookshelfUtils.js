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
    console.log("ID: " + model.id)
    ids.push(model.id);
  });
  return ids;
}