var logger = require('winston');
var fails = require('./fails.json');

function Command(name) {
  var command = require('./commands/' + name);
  if (typeof command === 'function') {
    command = command.apply(null, [].slice.call(arguments, 1));
  }
  Object.keys(command).forEach(function (key) {
    if (typeof command[key] === 'function') {
      var generator = command[key];
      command[key] = function *() {
        this.send = send;
        this.html = html;
        this.text = text;
        this.fail = fail;
        this.help = helper(command);
        yield generator;
      };
    }
  });
  return command;
}

function *send(message, options) {
  options = options || {};
  try {
    yield this.roomClient.sendNotification(message, {
      color: options.color || 'gray',
      format: options.format || 'html',
      notify: options.notify || false,
      card: options.card
    });
  } catch (err) {
    // ack's rest client throws an exception on an unexpected status code;
    // occasionally hipchat's rest api will return a 503, so this should
    // log that case and suppress the error to prevent an app crash
    var msg = 'Unexpected error type -- HipChat may not be responding';
    if (typeof err.message === 'string') {
      msg = err.message;
    } else if (typeof err === 'string') {
      msg = err;
    }
    logger.error(msg);
  }
}

function *html(message, options) {
  options = options || {};
  options.format = 'html';
  yield this.send(message, options);
}

function *text(message, options) {
  options = options || {};
  options.format = 'text';
  yield this.send(message, options);
}

function *image(url, iconUrl, title, options) {
  var message = url;
  options = options || {};
  options.card = {
    style: 'image',
    id: url,
    url: url,
    title: title,
    images: {
      image: url
    },
    icon: {
      url: iconUrl
    }
  };
  console.log(options);
  yield this.send(message, options);
}

function helper(command) {
  return function *(options) {
    var examples = [];
    command.examples.forEach(function (example) {
      examples.push('&nbsp;&nbsp;&nbsp;&nbsp;' + example);
    });
    var message =
      '<b>/' + command.aliases.join('</b>, <b>/') + '</b><br>' +
      command.description + ':<br>' +
      examples.join('<br>');
    yield this.html(message, options);
  };
}

function *fail(options) {
  yield this.text(fails[Math.floor(Math.random() * fails.length)], {color: 'red'});
}

module.exports = Command;
