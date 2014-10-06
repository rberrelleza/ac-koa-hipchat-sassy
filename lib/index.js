var modules = ['animation', 'giphy', 'face', 'image', 'info', 'lmgtfy', 'map', 'meme', 'video', 'weather'];

var commands = modules.map(Command);
var help = Command('help', commands);
commands.push(help);

exports.pattern = /^\/[\w:!\?\-]+/i;

exports.onInstall = function *() {
  yield help.installed;
};

exports.onCommand = function (tracker) {
  return function *() {
    var content = this.content;
    var match;
    var command;
    commands.some(function (c) {
      command = c;
      match = command.pattern.exec(content);
      return !!match;
    });
    if (match) {
      tracker.capture('command', {
        match: this.match && this.match[0],
        tenantId: this.tenant.id,
        groupId: this.tenant.group,
        roomId: this.roomId
      });
      this.match = match;
      yield command.run;
    }
  };
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
        this.fail = fail;
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
    format: options.format || 'html',
    notify: options.notify !== false
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
    var examples = [];
    command.examples.forEach(function (example) {
      examples.push('&nbsp;&nbsp;&nbsp;&nbsp;' + example);
    });
    var message =
      '<b>/' + command.aliases.join('</b>, <b>/') + '</b><br>' +
      command.description + ':<br>' +
      examples.join('<br>');
    yield this.html(message, options);
  };
}

function *fail(options) {
  var fails = require('./fails.json');
  yield this.text(fails[Math.floor(Math.random() * fails.length)], {color: 'red'});
}
