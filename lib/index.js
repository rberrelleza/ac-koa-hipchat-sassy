var modules = ['animation', 'face', 'freebase', 'help', 'image', 'lmgtfy', 'map', 'search', 'video'];

exports.commands = modules.map(function (mod) {
  mod = require('./commands/' + mod);
  return {
    pattern: mod.pattern,
    run: function *() {
      this.send = sender;
      this.env = enver;
      yield mod.run;
    }
  };
});

function *sender(message, options) {
  options = options || {};
  yield this.roomClient.sendNotification(message, {
    color: options.color || 'gray',
    format: options.format || 'html',
    notify: options.notify === false || true
  });
}

function *enver(key) {
  var value = process.env[key];
  if (!value) {
    throw new Error('Environment variable ' + key + ' required but not found');
  }
  return value;
}
