var request = require('co-request');

exports.respond = function (options) {
  return function *() {
    var image = yield exports.search(options);
    if (image) {
      message = exports.render(image);
    } else {
      message = 'Sorry, I didn\'t find good search results';
    }
    yield this.send(message);
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

exports.render = function (image) {
  var message;
  var url = image.unescapedUrl;
  if (!/(.gif|.jpe?g|.png)$/i.test(url)) {
    url += '#.png';
  }
  var size = exports.fit(image, 320, 240);
  if (size.w === 0 || size.h === 0) {
    message = 'The image I found was too weird to show you';
  } else {
    message = '' +
      '<a href="' + url + '">' +
      '<img src="' + url + '" width="' + size.w + '" height="' + size.h + '">' +
      '</a>';
  }
  return message;
};
