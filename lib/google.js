var request = require('co-request');
var qs = require('querystring');

var apiKey = process.env.GOOGLE_API_KEY;

exports.getter = function (apiPath, domain) {
  domain = domain || 'www';
  var baseUrl = 'https://' + domain + '.googleapis.com' + apiPath;
  return function (url, params) {
    return function *() {
      url = baseUrl + url;
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
};
