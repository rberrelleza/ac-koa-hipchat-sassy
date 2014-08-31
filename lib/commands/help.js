module.exports = function (commands) {
  var briefs = commands.filter(function (command) {
    return command.name !== 'help';
  }).map(function (command) {
    return command.examples;
  }).reduce(function(a, b) {
    return a.concat(b);
  }).map(function (example) {
    return (/^(\/\w+)(?:\s|$)/.exec(example) || [])[1];
  }).filter(function (example, i, array) {
    return array.indexOf(example) === i;
  }).sort();

  var help = 'Gopher displays content from the internet, on request. Type any of the following for more information:<br>';
  help += '&nbsp;&nbsp;&nbsp;&nbsp;<i>' + briefs.join('</i>, <i>') + '</i>';

  var self = {

    pattern: /^\/(gopher)(\s|$)/i,

    run: function *() {
      yield this.html(help);
    },

    installed: function *() {
      yield this.html('Gopher has been installed in this room. ' + help, {
        color: 'yellow'
      });
    }

  };

  return self;
};
