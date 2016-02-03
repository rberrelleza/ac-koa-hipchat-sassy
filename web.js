var track = require('ac-koa-hipchat-keenio').track;
var RedisStore = require('ac-node').RedisStore;

var ack = require('ac-koa').require('hipchat');
var pkg = require('./package.json');
var app = ack(pkg, {store: 'RedisStore'});

var commander = require('./lib/commander');

var addon = app.addon()
  .hipchat()
  .allowGlobal(true)
  .allowRoom(true)
  .scopes('send_notification', 'view_group');

var tracker = track(addon);
var addonStore = RedisStore(process.env['REDISCLOUD_URL'], 'sassy');

addon.webhook('room_message', commander.pattern, function *() {
  this.tracker = tracker;
  this.addonStore = addonStore;
  yield commander.onCommand;
});

app.listen();
