exports.pattern = /^\/(gopher)(\s|$)/i;

exports.run = function *() {
  yield this.send('TODO: halps!');
};
