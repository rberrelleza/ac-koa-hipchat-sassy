exports.pattern = /^\/sassy enable$/i;

exports.aliases = [];

exports.description = 'Enables sassy in this room';

exports.examples = [
  '/sassy enable'
];

var disable = require('./disable');

exports.run = function *() {
  var isDisabled = yield this.tenantRoomStore.get(disable.DISABLE_KEY);
  if (isDisabled) {
    yield this.tenantRoomStore.del(disable.DISABLE_KEY);
    yield this.html('Sassy has been enabled in this room.');
  } else {
    yield this.html('Sassy was already enabled in this room.')
  }
};
