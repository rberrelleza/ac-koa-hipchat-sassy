var images = require('../images');
var enc = encodeURIComponent;

var apiKey = process.env.GOOGLE_API_KEY;

exports.pattern = /^\/(?:map)(?:(?:\s+)(.+))?/i;

exports.description = 'Generates a map from a search phrase';

exports.examples = [
  '/map <i>search phrase</i>'
];

exports.run = function *() {
  var message;
  var query = this.match[1];
  query = query ? query.trim() : null;
  if (query) {
    var siteUrl = 'http://maps.google.com/?q=' + enc(query);
    var staticUrl = 'http://maps.googleapis.com/maps/api/staticmap' +
      '?center=' + enc(query) +
      '&markers=' + enc('color:red|label:A|shadow:false|' + query) +
      '&size=' + images.maxw + 'x' + images.maxh +
      '&scale=2';
    if (apiKey) {
      staticUrl += '&key=' + enc(apiKey);
    }
    yield this.html(
      '<a href="' + siteUrl + '">' +
      '<img src="' + staticUrl + '" width="' + images.maxw + '" height="' + images.maxh + '">' +
      '</a>'
    );
  } else {
    yield this.help();
  }
};
