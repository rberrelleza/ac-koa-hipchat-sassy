var track = require('ac-koa-hipchat-keenio').track;

var ack = require('ac-koa').require('hipchat');
var pkg = require('./package.json');
var app = ack(pkg, {store: 'MongoStore'});

var sassy = require('./lib');

var addon = app.addon()
  .hipchat()
  .allowGlobal(true)
  .allowRoom(true)
  .scopes('send_notification', 'view_group');

var tracker = track(addon);

addon.webhook('room_message', sassy.pattern, function *() {
  yield sassy.onCommand(tracker);
});

addon.onWebhook('install', sassy.onInstall);

app.listen();
