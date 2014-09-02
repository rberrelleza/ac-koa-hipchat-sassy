module.exports = function (commands) {
  var briefs = commands.filter(function (command) {
    return command.name !== 'help';
  }).map(function (command) {
    return '/' + command.aliases[0];
  }).filter(function (alias, i, array) {
    return array.indexOf(alias) === i;
  }).sort();

  var help = 'Sassy adds commands to search the internet for certain types of content. Type any of the following for more information:<br>';
  help += '&nbsp;&nbsp;&nbsp;&nbsp;<i>' + briefs.join('</i>, <i>') + '</i>';

  var self = {

    pattern: /^\/(sassy)(\s|$)/i,

    run: function *() {
      yield this.html(help);
    },

    installed: function *() {
      yield this.html('Sassy has been installed in this room. ' + help, {
        color: 'yellow'
      });
    }

  };

  return self;
};
