var ack = require('ac-koa').require('hipchat');
var pkg = require('./package.json');
var app = ack(pkg, {store: 'MongoStore'});

var gopher = require('./lib');

var addon = app.addon()
  .hipchat()
  .allowRoom(true)
  .scopes('send_notification', 'view_group');

addon.webhook('room_message', gopher.pattern, gopher.onCommand);

addon.onWebhook('install', gopher.onInstall);

app.listen();
