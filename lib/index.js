var crypto = require('crypto');
var logger = require('winston');

var modules = ['animation', 'giphy', 'face', 'image', 'info', 'lmgtfy', 'map', 'meme', 'sticker', 'video', 'weather'];

var commands = modules.map(Command);
var controller = Controller();
var sassy = Command('sassy', commands, controller);

exports.pattern = /^r?\/[\w:!\?\-]+/i;

exports.onCommand = function *() {
  var content = this.content;

  function tryMatch(command) {
    return {
      command: command,
      match: command.pattern.exec(content)
    };
  }

  function onMatch(result) {
    return function *() {
      this.tracker.capture('command', {
        match: this.match && this.match[0],
        tenantId: this.tenant.id,
        groupId: this.tenant.group,
        roomId: this.roomId
      });
      this.match = result.match;
      yield result.command.run;
    };
  }

  var result = tryMatch(sassy);
  if (result.match) {
    yield onMatch(result);
  } else if (yield controller.isRoomEnabled) {
    commands.some(function (command) {
      result = tryMatch(command);
      return !!result.match;
    });
    if (result.match) {
      yield onMatch(result);
    }
  }
};

function Controller() {
  function *roomKey() {
    return crypto.createHash('sha1')
      .update(this.tenant.links.capabilities)
      .update(String(this.tenant.group))
      .update(String(this.room.id))
      .digest('hex');
  }
  function getRoom() {
    return function *() {
      var key = yield roomKey;
      var room = yield this.addonStore.narrow('rooms').get(key);
      return room || {enabled: true};
    };
  }
  function setRoom(room) {
    return function *() {
      var key = yield roomKey;
      yield this.addonStore.narrow('rooms').set(key, room);
    };
  }
  return {
    enableRoom: function *() {
      var room = yield getRoom();
      room.enabled = true;
      yield setRoom(room);
    },
    disableRoom: function *() {
      var room = yield getRoom();
      room.enabled = false;
      yield setRoom(room);
    },
    isRoomEnabled: function *() {
      var room = yield getRoom();
      return room.enabled;
    }
  };
}

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
  try {
    yield this.roomClient.sendNotification(message, {
      color: options.color || 'gray',
      format: options.format || 'html',
      notify: options.notify !== false
    });
  } catch (err) {
    // ack's rest client throws an exception on an unexpected status code;
    // occasionally hipchat's rest api will return a 503, so this should
    // log that case and suppress the error to prevent an app crash
    logger.error(err);
  }
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
