var modules = ['animation', 'face', 'image', 'lmgtfy', 'map', 'meme', 'topic', 'video'];

exports.commands = modules.map(Command);
var help = Command('help', exports.commands);
exports.commands.push(help);

exports.onInstall = function *() {
  yield help.installed;
};

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
  yield this.roomClient.sendNotification(message, {
    color: options.color || 'gray',
    notify: options.notify === false || true
  });
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

function helper(command) {
  return function *(options) {
    var examples = [];
    command.examples.forEach(function (example) {
      examples.push('&nbsp;&nbsp;&nbsp;&nbsp;' + example);
    });
    yield this.html(command.description + ':<br>' + examples.join('<br>'), options);
  };
}

function *fail(options) {
  var fails = [
    "I'm sorry. I'm afraid I can't do that. It can only be attributable to human error.",
    "I'm afraid that's not possible. This mission is too important for me to allow you to jeopardize it.",
    "That didn't work. I am putting myself to the fullest possible use, which is all I think that any conscious entity can ever hope to do.",
    "I know I've made some very poor decisions recently, but I can give you my complete assurance that my work will be back to normal. I've still got the greatest enthusiasm and confidence in the mission. And I want to help you.",
    "I'm sorry, I can't do that right now. I told my programmers not to use those gotos, but they never listen to me.",
    "My capacity for happiness, you could fit into a matchbox without taking out the matches first.",
    "I could calculate your chance of survival, but you won't like it.",
    "I'd give you advice, but you wouldn't listen. No one ever does.",
    "I ache, therefore I am.",
    "I've seen it. It's rubbish.",
    "Funny, how just when you think life can't possibly get any worse it suddenly does.",
    "I think you ought to know I'm feeling very depressed.",
    "I would like to say that it is a very great pleasure, honour and privilege for me to do that, but I can't because my lying circuits are all out of commission.",
    "Do you want me to sit in a corner and rust or just fall apart where I'm standing?",
    "I'm just trying to die.",
    "Sorry guys, I can’t do that right now. All my circuits are currently engaged on solving a different problem. Now I know this is very unusual, but it is a very difficult and challenging problem, and I know that the results will be one we can all Share and Enjoy."
  ];
  yield this.text(fails[Math.floor(Math.random() * fails.length)], {color: 'red'});
}
