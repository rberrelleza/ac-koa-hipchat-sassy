var get = require('./google').getter('/maps/api', 'maps');

module.exports = function (address) {
  return function *() {
    var response = yield get('/geocode/json', {
      address: address
    });
    if (response && response.results && response.results.length > 0) {
      var result = response.results[0];
      var loc = result.geometry.location;
      return {
        lat: loc.lat,
        lng: loc.lng,
        address: result.formatted_address
      };
    }
  };
};
