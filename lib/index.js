var modules = ['animation', 'face', 'image', 'lmgtfy', 'map', 'meme', 'topic', 'video'];

exports.commands = modules.map(Command);
var help = Command('help', exports.commands);
exports.commands.push(help);

function Command(name) {
  var command = require('./commands/' + name);
  if (typeof command === 'function') {
    command = command.apply(null, [].slice.call(arguments, 1));
  }
  return {
    name: name,
    pattern: command.pattern,
    description: command.description,
    examples: command.examples,
    init: command.init,
    run: function *() {
      this.send = send;
      this.html = send;
      this.text = text;
      this.help = helper(command);
      yield command.run;
    }
  };
}

function *send(message, options) {
  options = options || {};
  yield this.roomClient.sendNotification(message, {
    color: options.color || 'gray',
    format: options.format || 'html',
    notify: options.notify === false || true
  });
}

function *text(message, options) {
  options = options || {};
  options.format = 'text';
  yield this.send(message, options);
}

function helper(command) {
  return function *() {
    var examples = [];
    command.examples.forEach(function (example) {
      examples.push('&nbsp;&nbsp;&nbsp;&nbsp;' + example);
    });
    yield this.html(command.description + ':<br>' + examples.join('<br>'));
  };
}
