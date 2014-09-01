var request = require('co-request');
var enc = encodeURIComponent;

exports.maxw = 320;
exports.maxh = 240;

exports.respond = function (options) {
  return function *() {
    var image = yield exports.search(options);
    if (image) {
      message = exports.render(image);
    } else {
      message = 'Sorry, your search phrase didn\'t yield usable images';
    }
    yield this.html(message);
  };
};

exports.search = function *(options) {
  var query = options.query;
  var first = options.first;
  var animated = options.animated;
  var face = options.face;
  var icon = options.icon;
  var q = {v: '1.0', rsz: '8', q: query, safe: 'active'};

  if (animated) {
    q.imgtype = 'animated';
  }
  if (face) {
    q.imgtype = 'face';
  }
  if (icon) {
    q.imgsz = 'icon';
  }

  var response = yield request.get({
    url: 'http://ajax.googleapis.com/ajax/services/search/images',
    qs: q
  });

  if (response.body) {
    var images = JSON.parse(response.body);
    if (images.responseData) {
      images = images.responseData.results;
      if (images && images.length > 0) {
        var index = first === true ? 0 : Math.floor(Math.random() * images.length);
        var image = images[index];
        if (image && image.unescapedUrl) {
          return image;
        }
      }
    }
  }
};

exports.proxy = function (url, w, h) {
  w = w || exports.maxw;
  h = h || exports.maxh;
  return 'https://ir0.mobify.com/' + enc(w) + '/' + enc(h) + '/' + enc(url);
};

exports.render = function (image) {
  var message;
  var url = image.unescapedUrl;
  return '<a href="' + url + '"><img src="' + exports.proxy(url) + '"></a>';
};
