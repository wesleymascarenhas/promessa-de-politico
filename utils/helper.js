exports.randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.randomIndex = function(collection) {
  return this.randomInt(0, collection.length - 1);
}

exports.merge = function(first, second) {
  for (var attr in first) { 
    second[attr] = first[attr]; 
  }
}