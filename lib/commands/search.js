exports.pattern = /^\/(?:search)(?:(?:\s+)(.+))?/i;

exports.run = function *() {
  yield this.send('TODO: basic search');
};
