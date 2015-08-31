var request = require('co-request');
var enc = encodeURIComponent;

exports.maxw = 300;
exports.maxh = 250;

exports.respond = function (options) {
  return function *() {
    var image = yield exports.search(options);
    if (image) {
      if (options.text) {
        result = {
          type: 'text',
          message: exports.ensureExt(image.unescapedUrl)
        };
      } else {
        result = yield exports.render(image);
      }
    } else {
      result = {
        type: 'text',
        message: 'Sorry, your search phrase didn\'t yield any usable images'
      };
    }
    yield this[result.type](result.message);
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
    q.as_filetype = 'gif';
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

  if (response.statusCode === 200 && response.body) {
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

exports.fit = function (image, maxw, maxh) {
  var w = image.width >>> 0;
  var h = image.height >>> 0;
  var r;
  if (w > 0 && h > 0) {
   if (w > maxw) {
     r = maxw / w;
     w = maxw;
     h = h * r;
   }
   if (h > maxh) {
     r = maxh / h;
     w = w * r;
     h = maxh;
   }
  }
  return {
   w: w,
   h: h
  };
};

exports.proxy = function *(url, w, h) {
  w = w || exports.maxw;
  h = h || exports.maxh;
  var proxyUrl;
  var match = /^(https?:\/\/)(.+)/.exec(url);
  if (match) {
    url = match[1] + 'images.weserv.nl/?url=' + enc(match[2]) + '&h=' + enc(h) + '&w=' + enc(w);
    var response = yield request.head(url);
    if (response.statusCode === 200) {
      proxyUrl = url;
    }
  }
  return proxyUrl;
};

exports.render = function *(image) {
  var type = 'text';
  var message;
  var url = image.unescapedUrl;
  var size = exports.fit(image, exports.maxw, exports.maxh);
  if (size.w === 0 || size.h === 0) {
    message = 'The image I found was too weird to show you';
  } else {
    type = 'text';
    message = url;
  }
  return {
    type: type,
    message: message
  };
};

exports.ensureExt = function (url) {
  if (!/(.gif|.jpe?g|.png)$/i.test(url)) {
    url += '#.png';
  }
  return url;
}
