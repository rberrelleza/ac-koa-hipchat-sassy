var request = require('co-request');
var get = require('./google').getter('/customsearch/v1', 'www');
var enc = encodeURIComponent;

exports.maxw = 300;
exports.maxh = 250;

var cseId = process.env.GOOGLE_CSE_ID;
if (!cseId) {
  throw new Error('Environment variable GOOGLE_CSE_ID is required');
}

exports.respond = function (options) {
  return function *() {
    var image = yield exports.search(options);
    if (image) {
      if (options.format === 'html') {
        result = yield exports.render(image);
        return yield this[result.type](result.message);
      } else {
        var imageUrl = exports.ensureExt(image.link);
        return yield this.text(imageUrl);
      }
    } else {
      return yield this.text('Sorry, your search phrase didn\'t yield any usable images');
    }
  };
};

exports.search = function *(options) {
  var q = {
    q: options.query,
    cx: cseId,
    safe: 'high',
    searchType: 'image'
  };

  if (options.animated) {
    q.fileType = 'gif';
  }
  if (options.face) {
    q.imgType = 'face';
  }
  if (options.icon) {
    q.imgSize = 'icon';
  }

  var response = yield get('/', q);

  if (response && response.items && response.items.length > 0) {
    var images = response.items;
    var index = options.first === true ? 0 : Math.floor(Math.random() * images.length);
    return images[index];
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
  var url = image.link;
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
  if (!/(\.gif|\.jpe?g|\.png)$/i.test(url)) {
    url += '#.png';
  }
  return url;
}
