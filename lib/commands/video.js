var request = require('co-request');

var apiKey = process.env.YOUTUBE_API_KEY;
if (!apiKey) {
  throw new Error('Environment variable YOUTUBE_API_KEY is required');
}

exports.pattern = /^\/(?:video|youtube|yt)(!)?(?:(?:\s+)(.+))?/i;

exports.aliases = ['video', 'youtube', 'yt'];

exports.description = 'Searches for a video';

exports.examples = [
  '/video <b>{search phrase}</b>'
];

exports.run = function *() {
  var message = 'Sorry, I didn\'t find any good search results';
  var first = !!this.match[1];
  var query = this.match[2];
  query = query ? query.trim() : null;
  if (query) {
    var response = yield request.get({
      url: 'https://www.googleapis.com/youtube/v3/search',
      qs: {
        key: apiKey,
        part: 'id',
        type: 'video',
        maxResults: 10,
        q: query
      }
    });
    if (response.body) {
      var data = JSON.parse(response.body);
      var videos = data.items;
      if (videos && videos.length) {
        var index = first === true ? 0 : Math.floor(Math.random() * videos.length);
        message = 'https://www.youtube.com/watch?v=' + videos[index].id.videoId;
      }
    }
  } else {
    return yield this.help();
  }
  yield this.text(message);
};
