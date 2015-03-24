var logger = require('winston');

var Command = require('./command');
var RoomManager = require('./room-manager');

var modules = ['animation', 'giphy', 'face', 'image', 'info', 'lmgtfy', 'map', 'meme', 'sticker', 'video', 'weather'];

var commands = modules.map(Command);
var roomManager = RoomManager();
var sassy = Command('sassy', commands, roomManager);

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
  } else if (yield roomManager.isRoomEnabled) {
    commands.some(function (command) {
      result = tryMatch(command);
      return !!result.match;
    });
    if (result.match) {
      yield onMatch(result);
    }
  }
};
