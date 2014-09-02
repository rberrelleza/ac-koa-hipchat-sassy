var geocode = require('../geocode');
var request = require('co-request');
var enc = encodeURIComponent;

var apiKey = process.env.FORECAST_API_KEY;
if (!apiKey) {
  throw new Error('Environment variable FORECAST_API_KEY is required');
}

exports.pattern = /^\/(?:weather)(?:(?:\s+)(.+))?/i;

exports.description = 'Displays current weather or a forecast for the given location';

exports.examples = [
  '/weather <i>location</i>'
];

exports.run = function *() {
  var message;
  var query = this.match[1];
  query = query ? query.trim() : null;
  if (query) {
    var loc = yield geocode(query);
    if (loc) {
      var ll = loc.lat + ',' + loc.lng;
      var url = 'https://api.forecast.io/forecast/' + enc(apiKey) + '/' + enc(ll);
      var response = yield request.get(url);
      if (response && response.statusCode === 200) {
        var forecast = JSON.parse(response.body);
        var siteUrl = 'http://forecast.io/#/f/' + ll;
        var temp = Math.floor(forecast.currently.temperature);
        var feelsLike = Math.floor(forecast.currently.apparentTemperature);
        message =
          '<a href="' + siteUrl + '">Weather for ' + loc.address + '</a><br>' +
          'Temperature: <b>' + temp + '</b>' +
          (temp !== feelsLike ? ' (feels like ' + feelsLike + ')' : '') + '<br>' +
          'Currently: <b>' + forecast.currently.summary + '</b><br>' +
          'Next 24 hours: <b>' + forecast.hourly.summary + '</b><br>' +
          'This week: <b>' + forecast.daily.summary + '</b>';
      } else {
        message = 'Sorry, I couldn\'t get a forecast for that location';
      }
    } else {
      message = 'Sorry, I didn\'t recognize that location';
    }
    yield this.html(message);
  } else {
    yield this.help();
  }
};
