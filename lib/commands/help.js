exports.pattern = /^\/(googler)(\s|$)/i;

exports.run = function *() {
  yield this.send('TODO: halps!');
};
