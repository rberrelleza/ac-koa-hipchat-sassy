var images = require('../images');

exports.pattern = /^\/(?:img|image)(!)?(?:(?:\s+)(.+))?/i;

exports.aliases = ['img', 'image'];

exports.description = 'Searches Google for an image';

exports.examples = [
  '/img <b>{search phrase}</b>',
];

exports.run = function *() {
  var message;
  var first = !!this.match[1];
  var query = this.match[2];
  query = query ? query.trim() : null;
  if (query) {
    yield images.respond({
      query: query,
      first: first
    });
  } else {
    yield this.help();
  }
};
