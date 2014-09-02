if (process.env.NODETIME_ACCOUNT_KEY) {
  require('nodetime').profile({
    accountKey: process.env.NODETIME_ACCOUNT_KEY,
    appName: 'Sassy'
  });
}

var ack = require('ac-koa').require('hipchat');
var pkg = require('./package.json');
var app = ack(pkg, {store: 'MongoStore'});

var sassy = require('./lib');

var addon = app.addon()
  .hipchat()
  .allowRoom(true)
  .scopes('send_notification', 'view_group');

addon.webhook('room_message', sassy.pattern, sassy.onCommand);

addon.onWebhook('install', sassy.onInstall);

app.listen();
