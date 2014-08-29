exports.pattern = /^\/(?:topic)(?:(?:\s+)(.+))?/i;

exports.description = 'Searches for a topic';

exports.examples = [
  '/topic <i>search phrase</i>'
];

exports.run = function *() {
  yield this.help();
};
