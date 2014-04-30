var slugify = require('slug');
slugify.charmap['.'] = ' ';
module.exports = slugify;