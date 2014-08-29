exports.pattern = /^\/(?:map)(?:(?:\s+)(.+))?/i;

exports.description = 'Generates a map from a search phrase';

exports.examples = [
  '/map <i>search phrase</i>'
];

exports.run = function *() {
  yield this.help();
};
