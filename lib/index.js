var modules = ['animation', 'face', 'image', 'lmgtfy', 'map', 'meme', 'topic', 'video'];

exports.commands = modules.map(Command);
var help = Command('help', exports.commands);
exports.commands.push(help);

exports.onInstall = function *() {
  yield help.installed;
};

function Command(name) {
  var command = require('./commands/' + name);
  if (typeof command === 'function') {
    command = command.apply(null, [].slice.call(arguments, 1));
  }
  Object.keys(command).forEach(function (key) {
    if (typeof command[key] === 'function') {
      var generator = command[key];
      command[key] = function *() {
        this.send = send;
        this.html = html;
        this.text = text;
        this.help = helper(command);
        yield generator;
      };
    }
  });
  return command;
}

function *send(message, options) {
  options = options || {};
  yield this.roomClient.sendNotification(message, {
    color: options.color || 'gray',
    notify: options.notify === false || true
  });
}

function *html(message, options) {
  options = options || {};
  options.format = 'html';
  yield this.send(message, options);
}

function *text(message, options) {
  options = options || {};
  options.format = 'text';
  yield this.send(message, options);
}

function helper(command) {
  return function *(options) {
    console.log('helper#anonymous');
    var examples = [];
    command.examples.forEach(function (example) {
      examples.push('&nbsp;&nbsp;&nbsp;&nbsp;' + example);
    });
    yield this.html(command.description + ':<br>' + examples.join('<br>'), options);
  };
}
