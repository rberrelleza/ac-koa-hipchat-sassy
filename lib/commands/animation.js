var images = require('../images');

exports.pattern = /^\/(?:anim(?:ation)?)(!)?(?:(?:\s+)(.+))?/i;

exports.aliases = ['anim', 'animation'];

exports.description = 'Search for an animated image';

exports.examples = [
  '/anim <b>{search phrase}</b>',
];

exports.run = function *() {
  var message;
  var first = !!this.match[1];
  var query = this.match[2];
  query = query ? query.trim() : null;
  if (query) {
    yield images.respond({
      animated: true,
      query: query,
      first: first
    });
  } else {
    yield this.help();
  }
};
