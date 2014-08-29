var images = require('../images');

exports.pattern = /^\/(?:meme|memegen|mgen)(?:(?:\s+)(.+))?/i;

exports.description = 'Create a meme image';

exports.examples = [
  '/meme patterns',
  '/meme <i>image url</i> | <i>top text</i> | <i>bottom text</i>',
  '/meme <i>image search</i> | <i>top text</i> | <i>bottom text</i>',
  '/memegen <i>*</i>',
  '/mgen <i>*</i>'
];

exports.run = function *() {
  // TODO
  yield this.help();
};
