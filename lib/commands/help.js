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

  var self = {

    pattern: /^\/(gopher)(\s|$)/i,

    run: function *() {
      var message = 'Gopher provides several commands for fetching content -- type any of the following for more information:<br>';
      message += '&nbsp;&nbsp;&nbsp;&nbsp;<i>' + briefs.join('</i>, <i>') + '</i>';
      yield this.html(message);
    }

  };

  return self;
};
