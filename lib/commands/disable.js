exports.pattern = /^\/sassy\s+disable$/i;

exports.aliases = [];

exports.description = 'Disables sassy in this room';

exports.examples = [
  '/sassy disable'
];

var DISABLE_KEY = 'disabled';
exports.DISABLE_KEY = DISABLE_KEY;

exports.run = function *() {
  var isDisabled = yield this.tenantRoomStore.get(DISABLE_KEY);
  if (!isDisabled) {
    yield this.tenantRoomStore.set('disabled', true);
    yield this.html('Sassy has been disabled in this room.')
  }
};
