exports.pattern = /^\/sassy\s+disable$/i;

exports.aliases = ['disable'];

exports.description = 'Disables sassy in this room';

exports.examples = [
    '/sassy disable'
];

exports.run = function *() {
    yield this.help();
};
