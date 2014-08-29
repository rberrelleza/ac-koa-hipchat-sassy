var images = require('../images');

exports.pattern = /^\/(?:face)(!)?(?:(?:\s+)(.+))?/i;

exports.description = 'Search for an image of a face';

exports.examples = [
  '/face <i>search phrase</i>'
];

exports.run = function *() {
  var message;
  var first = !!this.match[1];
  var query = this.match[2];
  query = query ? query.trim() : null;
  if (query) {
    yield images.respond({
      face: true,
      query: query,
      first: first
    });
  } else {
    yield this.help();
  }
};
