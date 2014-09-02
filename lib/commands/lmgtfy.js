exports.pattern = /^\/(?:lmgtfy)(?:(?:\s+)(.+))?/i;

exports.aliases = ['lmgtfy', 'google'];

exports.description = 'Helps someone perform a Google search';

exports.examples = [
  '/lmgtfy <b>{search phrase}</b>'
];

exports.run = function *() {
  var query = this.match[1];
  query = query ? query.trim() : null;
  if (query) {
    yield this.text('http://lmgtfy.com?q=' + encodeURIComponent(query.trim()));
  } else {
    yield this.help();
  }
};
