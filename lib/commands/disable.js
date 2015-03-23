exports.pattern = /^\/sassy\s+disable$/i;

exports.aliases = [];

exports.description = 'Disables sassy in this room';

exports.examples = [
  '/sassy disable'
];

exports.run = function *() {
  var store = this.tenantStore.narrow(this.room.id);
  var isDisabled = yield store.get('disabled');
  if (isDisabled) {
    yield this.html('Sassy is already disabled in this room.');
  } else {
    yield store.set('disabled', true);
    yield this.html('Sassy has been disabled in this room.')
  }
};
