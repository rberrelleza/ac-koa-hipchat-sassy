exports.pattern = /^\/(?:lmgtfy)(?:(?:\s+)(.+))?/i;

exports.description = 'Helps someone perform a Google search';

exports.examples = [
  '/lmgtfy <i>search phrase</i>'
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
