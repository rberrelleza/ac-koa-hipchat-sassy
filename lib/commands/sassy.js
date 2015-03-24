module.exports = function (commands, roomManager) {
  var briefs = commands.filter(function (command) {
    return command.name !== 'help';
  }).map(function (command) {
    return '/' + command.aliases[0];
  }).filter(function (alias, i, array) {
    return array.indexOf(alias) === i;
  }).sort();

  var addonHelp =
    'Sassy adds commands to search the internet for certain types of content. Type any of the following for more information:<br>' +
    '&nbsp;&nbsp;&nbsp;&nbsp;<i>' + briefs.join('</i>, <i>') + '</i>';

  return {

    pattern: /^\/sassy(?:(?:\s+(enable|disable)\b)?|$)/i,

    run: function *() {
      var fullHelp = addonHelp;
      var isGlobal = !this.tenant.room;
      var command = this.match[1];
      if (isGlobal) {
        if (command === 'enable') {
          yield roomManager.enableRoom;
        } else if (command === 'disable') {
          yield roomManager.disableRoom;
        }
        var states = ['disable', 'enable'];
        if (yield roomManager.isRoomEnabled) {
          states.reverse();
        }
        var stateHelp =
          'Sassy is <b>' + states[0] + 'd</b> in this room.  To <i>' + states[1] + '</i> it, use:<br>' +
          '&nbsp;&nbsp;&nbsp;&nbsp;<i>/sassy ' + states[1] + '</i>';
        fullHelp = command ? stateHelp : addonHelp + '<br><br>' + stateHelp;
      }
      yield this.html(fullHelp);
    }

  };
};
