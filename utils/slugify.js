var slugify = require('slug');
slugify.charmap['.'] = ' ';

exports.slug = function(str) {
  return slugify(str).toLowerCase();
}