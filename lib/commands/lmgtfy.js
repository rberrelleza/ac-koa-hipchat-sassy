exports.pattern = /^\/(?:lmgtfy)(?:(?:\s+)(.+))?/i;

exports.run = function *() {
  var query = this.match[1];
  query = query ? query.trim() : null;
  if (query) {
    message += 'http://lmgtfy.com?q=' + encodeURIComponent(query.trim());
  } else {
    message = 'Usage: /lmgtfy <i>search phrase</i>';
  }
  yield this.send(message);
};
