var _ = require('lodash');
var request = require('co-request');

var postTemplate = _.template('<%= title %> <%= url %>');

var matchers = {
  '(new|rising)$': postFromAll,
  '(top|hot|controversial)?\\/?(hour|day|week|month|year|all)?$': postFromAll,
  '([\\w\\-]+)\\/?(new|rising)?$': postsFromSubReddit,
  '([\\w\\-]+)\\/(top|hot|controversial)?\\/?(hour|day|week|month|year|all)?$': postsFromSubReddit
};

exports.pattern = /^(?:(?:\/(?:reddit\s+))|(?:r\/))(\w+(?:\/\w+)*)?/i;

exports.aliases = ['reddit'];

exports.description = 'Displays the top post from Reddit';

exports.examples = [
  '/reddit <b>{subreddit}</b>',
  '/reddit <b>{subreddit}</b>/<b>{filter}</b>',
  '/reddit <b>{subreddit}</b>/<b>{duration}</b>',
  '/reddit <b>{subreddit}</b>/<b>{filter}</b>/<b>{duration}</b>',
  'r/<b>{subreddit}</b>',
  'r/<b>{subreddit}</b>/<b>{filter}</b>',
  'r/<b>{subreddit}</b>/<b>{duration}</b>',
  'r/<b>{subreddit}</b>/<b>{filter}</b>/<b>{duration}</b>'
];

exports.run = function *() {
  var query = this.match[1];
  query = query ? query.trim() : null;
  if (query) {
    for (var pattern in matchers) {
      var reg = new RegExp('^' + pattern);
      var handler = matchers[pattern];
      var match = reg.exec(query);
      if (match && !this.isPrevented) {
        var matches = match.slice(1);
        var message = yield handler(matches);
        yield this.text(message);
      }
    }
  } else {
    yield this.help();
  }
};

function postFromAll(matches) {
  return function *() {
    this.isPrevented = true;
    matches.unshift('all');
    return yield postsFromSubReddit(matches);
  };
}

function postsFromSubReddit(matches) {
  return function *() {
    var params = getParamsForMatches(matches);
    var posts = yield doRedditRequest(params);
    return renderPosts(posts, params, 1);
  };
}

function renderPosts(posts, params, count) {
  if (posts.length) {
    posts = _.filter(posts, function (post) {
      return !post.data.over_18;
    });
    posts = _.filter(posts, function (post) {
      return !post.data.stickied;
    });
    if (params.minScore) {
      posts = _.filter(posts, function (post) {
        return post.data.score >= params.minScore;
      });
    }
    posts = _.map(posts, function (post) {
      return postTemplate(post.data);
    });
    return posts.join('\n');
  }
  return 'No posts in this subreddit (sadpanda)';
}

function doRedditRequest(params) {
  return function *() {
    var response = yield request.get({
      url: getRedditUrlForParams(params),
      json: true
    });
    var json = response.body;
    return (json.data && json.data.children && json.data.children.length) ? json.data.children : [];
  };
}

function getParamsForMatches(matches) {
  var params = {
    sub: 'all'
  };
  if (matches[0] != undefined) {
    params.sub = matches[0];
  }
  if (matches[1] != undefined) {
    params.sort = matches[1];
  }
  if (matches[2] != undefined) {
    params.duration = matches[2];
  }
  if (matches[3] != undefined) {
    var minScore = parseInt(matches[3]);
    if (!isNaN(minScore)) {
      params.minScore = minScore;
    }
  }
  return params;
}

function getRedditUrlForParams(params) {
  var url = 'http://www.reddit.com/';
  if (params.sub) {
    url += 'r/' + params.sub;
  }
  if (params.sort) {
    url += '/' + params.sort;
  }
  url += '/.json';
  if (params.duration) {
    url += '?t=' + params.duration;
  }
  return url;
}
