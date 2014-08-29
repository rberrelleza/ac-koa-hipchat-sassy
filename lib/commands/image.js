var images = require('../images');

exports.pattern = /^\/(?:img|image)(!)?(?:(?:\s+)(.+))?/i;

exports.description = 'Searches for an image';

exports.examples = [
  '/image <i>search phrase</i>',
  '/img <i>search phrase</i>'
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
