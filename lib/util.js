exports.env = function (key) {
  var value = process.env[key];
  if (!value) {
    throw new Error('Environment variable ' + key + ' required but not found');
  }
  return value;
};
