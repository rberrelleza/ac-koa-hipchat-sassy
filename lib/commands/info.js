var request = require('co-request');
var qs = require('querystring');
var images = require('../images');

var apiKey = process.env.GOOGLE_API_KEY;

exports.pattern = /^\/(?:info)(?:(?:\s+)(.+))?/i;

exports.description = 'Provides an informational summary of the best match for a search phrase';

exports.examples = [
  '/info <i>search phrase</i>'
];

exports.run = function *() {
  var message;
  var query = this.match[1];
  query = query ? query.trim() : null;
  if (query) {
    yield search(query);
  } else {
    yield this.help();
  }
};

function search(query) {
  return function *() {
    var response = yield get('/search', {
      query: query,
      limit: 1
    });
    if (response && response.result && response.result.length === 1) {
      var msg;
      var result = response.result[0];
      var properties = yield topic(result.id);
      if (properties) {
        msg = render(result.name, properties);
      }
      if (!msg) {
        yield notFound;
        return;
      }
      yield this.html(msg);
    } else {
      yield notFound;
    }
  };
}

function render(name, properties) {
  var msg = '';
  var link = find(properties, 'official_website');
  if (!link) {
    link = find(properties, 'topic_equivalent_webpage');
  }
  if (!link) {
    link = find(properties, 'topical_webpage');
  }
  if (link && link.values && link.values.length === 1) {
    link = link.values[0].value;
  }
  var title = '<strong>' + name + '</strong>';
  if (link) {
    title = '<a href="' + link + '">' + title + '</a>';
  }
  msg += title + '<br>';
  var image = find(properties, 'image');
  if (image && image.values && image.values.length === 1) {
    image = imageUrl(image.values[0].id);
    image = '<img src="' + image + '" align="left">';
    if (link) {
      image = '<a href="' + link + '">' + image + '</a>';
    }
    msg += image;
  }
  var description = find(properties, 'description');
  if (description && description.values && description.values.length === 1) {
    description = description.values[0].value;
    msg += description.replace(/\n/g, '<br>\n');
  }
  return msg;
}

function topic(id) {
  return function *() {
    var result = yield get('/topic' + id, {
      filter: [
        '/common/topic/description',
        '/common/topic/image',
        '/common/topic/official_website',
        '/common/topic/topic_equivalent_webpage',
        '/common/topic/topical_webpage',
      ],
      lang: 'en',
      limit: 1
    });
    if (result) {
      return result.property;
    } else {
      yield notFound;
    }
  };
}

function find(properties, key) {
  return properties['/common/topic/' + key];
}

function imageUrl(id) {
  return images.proxy('https://usercontent.googleapis.com/freebase/v1/image' + id, 100, 100);
}

function get(url, params) {
  return function *() {
    url = 'https://www.googleapis.com/freebase/v1' + url;
    params = params || {};
    if (apiKey) {
      params.key = apiKey;
    }
    if (Object.keys(params).length > 0) {
      url += '?' + qs.stringify(params);
    }
    var response = yield request.get(url);
    if (response.statusCode === 200 && response.body) {
      return JSON.parse(response.body);
    }
  };
}

function *notFound() {
  yield this.html('Sorry, your search phrase didn\'t yield any interesting results');
}
