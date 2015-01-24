var request = require('co-request');

var apiKey = process.env.GIPHY_API_KEY;
if (!apiKey) {
  throw new Error('Environment variable GIPHY_API_KEY is required');
}

exports.pattern = /^\/(?:giphy|gif)(!)?(?:(?:\s+)(.+))?/i;

exports.aliases = ['giphy', 'gif'];

exports.description = 'Searches Giphy for an animated image';

exports.examples = [
  '/giphy <b>{search phrase}</b>'
];

exports.run = function *() {
  var message;
  var first = !!this.match[1];
  var query = this.match[2];
  query = query ? query.trim() : null;
  if (query) {
    var url = 'http://api.giphy.com/v1/gifs/search';
    var response = yield request.get(url, {
      qs: {
        q: query,
        limit: 10,
        api_key: apiKey,
        rating: 'pg-13'
      }
    });
    if (response && response.statusCode === 200) {
      var json = JSON.parse(response.body);
      var images = json && json.data;
      if (images.length > 0) {
        var index = first === true ? 0 : Math.floor(Math.random() * images.length);
        var image = images[index];
        if (image && image.images) {
          var variant = (image.images.fixed_height || image.images.original);
          if (variant && variant.url) {
            message = variant.url;
          }
        }
      }
    }
    if (!message) {
      message = 'Sorry, no gifs matched your search phrase';
    }
    yield this.text(message);
  } else {
    yield this.help();
  }
};
