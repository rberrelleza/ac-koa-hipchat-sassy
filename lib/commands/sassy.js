module.exports = function (commands, controller) {
  var briefs = commands.filter(function (command) {
    return command.name !== 'help';
  }).map(function (command) {
    return '/' + command.aliases[0];
  }).filter(function (alias, i, array) {
    return array.indexOf(alias) === i;
  }).sort();

  var help =
    'Sassy adds commands to search the internet for certain types of content. Type any of the following for more information:<br>' +
    '&nbsp;&nbsp;&nbsp;&nbsp;<i>' + briefs.join('</i>, <i>') + '</i>';

  var self = {

    pattern: /^\/sassy(?:(?:\s+(enable|disable)\b)?|$)/i,

    run: function *() {
      var fullHelp = help;
      var isGlobal = !this.tenant.room;
      if (isGlobal) {
        if (this.match[1] === 'enable') {
          yield controller.enableRoom;
        } else if (this.match[1] === 'disable') {
          yield controller.disableRoom;
        }
        var states = ['disable', 'enable'];
        if (yield controller.isRoomEnabled) {
          states.reverse();
        }
        fullHelp +=
          '<br><br>Sassy is <b>' + states[0] + 'd</b> in this room.  To <i>' + states[1] + '</i> it, use:<br>' +
          '&nbsp;&nbsp;&nbsp;&nbsp;<i>/sassy ' + states[1] + '</i>';
      }
      yield this.html(fullHelp);
    }

  };

  return self;
};
