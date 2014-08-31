var ack = require('ac-koa').require('hipchat');
var pkg = require('./package.json');
var app = ack(pkg, {store: 'MongoStore'});

var gopher = require('./lib');

var addon = app.addon()
  .hipchat()
  .allowRoom(true)
  .scopes('send_notification');

gopher.commands.forEach(function (command) {
  addon.webhook('room_message', command.pattern, command.run);
});

// addon.onWebhook('install', gopher.onInstall);
addon.onWebhook('install', function *() {
  yield gopher.onInstall;
});

app.listen();
