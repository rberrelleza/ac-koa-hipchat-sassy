var images = require('../images');
var request = require('co-request');
var logger = require('winston');

exports.pattern = /^\/(?:meme|memegen|mgen)(?:(?:\s+)(.+))?/i;

exports.aliases = ['meme', 'memegen', 'mgen'];

exports.description = 'Creates a meme with one of the following patterns';

var matchers = [{
  // Match custom "x|y|z" meme first or it may get matched by another pattern.
  pattern: /^(?:(https?:\/\/[^|\s]+\.(?:jpe?g|gif|png)[^|\s]*)|([^|]+))\s*\|\s*([^|]*)\s*\|\s*([^|]*)/i,
  help: '<b>{image url or search}</b> | <b>{top text}</b> | <b>{bottom text}</b>',
  run: function *() {
    if (this.$1) {
      yield generate(this.$1, this.$3, this.$4);
    } else {
      args = this.$2;
      var image = yield images.search({
        query: this.$2,
        first: true
      });
      if (image) {
        yield generate(image.unescapedUrl, this.$3, this.$4);
      } else {
        yield this.html('Sorry, your search didn\'t yield any usable images');
      }
    }
  }
}, {
  pattern: /^(y u no) (.*)/i,
  help: 'y u no <b>{text}</b>',
  url: 'http://memecaptain.com/y_u_no.jpg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^aliens? guy (.+)/i,
  help: 'aliens guy <b>{text}</b>',
  url: 'http://memecaptain.com/aliens.jpg',
  run: function *() {
    yield generate(this.url, '', this.$1);
  }
}, {
  pattern: /^((?:prepare|brace) (?:yourself|yourselves)) (.+)/i,
  help: 'brace yourself <b>{text}</b>',
  url: 'http://i.imgur.com/cOnPlV7.jpg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(.*) (all the .*)/i,
  help: '<b>{text}</b> all the <b>{things}</b>',
  url: 'http://memecaptain.com/all_the_things.jpg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(i don'?t (?:always|normally) .*) (but when i do,? .*)/i,
  help: 'I don\'t always <b>{something}</b> but when I do <b>{text}</b>',
  url: 'http://memecaptain.com/most_interesting.jpg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(.*) (\w+\stoo damn .*)/i,
  help: '<b>{text}</b> too damn <b>{something}</b>',
  url: 'http://memecaptain.com/too_damn_high.jpg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(not sure if .*) (or .*)/i,
  help: 'not sure if <b>{something}</b> or <b>{something else}</b>',
  url: 'http://memecaptain.com/fry.png',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(yo dawg .*) (so .*)/i,
  help: 'yo dawg <b>{text}</b> so <b>{text}</b>',
  url: 'http://memecaptain.com/xzibit.jpg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(all your .*) (are belong to .*)/i,
  help: 'all your <b>{text}</b> are belong to <b>{text}</b>',
  url: 'http://i.imgur.com/gzPiQ8R.jpg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(one does not simply) (.*)/i,
  help: 'one does not simply <b>{text}</b>',
  url: 'http://memecaptain.com/boromir.jpg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(if you .*\s)(.* gonna have a bad time)/i,
  help: 'if you <b>{text}</b> gonna have a bad time',
  url: 'http://memecaptain.com/bad_time.jpg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(if .*), ((?:are|can|do|does|how|is|may|might|should|then|what|when|where|which|who|why|will|won't|would) .*)/i,
  help: 'if <b>{text}</b>, <b>{word that can start a question}</b> <b>{text}</b>?',
  url: 'http://memecaptain.com/philosoraptor.jpg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^((?:how|what|when|where|who|why) the (?:hell|heck|fuck|shit|crap|damn)) (.*)/i,
  help: '<b>{word that can start a question}</b> the <b>{expletive}</b> <b>{text}</b>',
  url: 'http://memecaptain.com/src_images/z8IPtw',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(?:success|nailed it) when (.*) then (.*)/i,
  help: 'success when <b>{text}</b> then <b>{text}</b>',
  url: 'http://memecaptain.com/success_kid.jpg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(?:fwp|cry) when (.*) then (.*)/i,
  help: 'cry when <b>{text}</b> then <b>{text}</b>',
  url: 'http://v1.memecaptain.com/first_world_problems.jpg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^bad luck when (.*) then (.*)/i,
  help: 'bad luck when <b>{text}</b> then <b>{text}</b>',
  url: 'http://v1.memecaptain.com/bad_luck_brian.jpg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^scumbag(?: steve)? (.*) then (.*)/i,
  help: 'scumbag <b>{text}</b> then <b>{text}</b>',
  url: 'http://v1.memecaptain.com/scumbag_steve.jpg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(what if i told you) (.+)/i,
  help: 'what if I told you <b>{text}</b>',
  url: 'http://memecaptain.com/src_images/fWle1w',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(i hate) (.+)/i,
  help: 'I hate <b>{text}</b>',
  url: 'http://memecaptain.com/src_images/_k6JVg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(why can'?t (?:i|we|you|he|she|it|they)) (.+)/i,
  help: 'why can\'t <b>{personal pronoun}</b> <b>{text}</b>',
  url: 'http://i0.kym-cdn.com/photos/images/newsfeed/000/075/683/limes_guy.jpg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(.+),? (so i(?:(?:(?:'?ve)? got)|(?: have)) that going for me(?:,? which is nice)?)/i,
  help: '<b>{text}</b> so I got that going for me',
  url: 'http://memecaptain.com/src_images/h9ct5g',
  run: function *() {
    var text2 = this.$2;
    if (!/\bwhich is nice$/.test(text2)) {
      text2 += ', which is nice';
    }
    yield generate(this.url, this.$1, text2);
  }
}, {
  pattern: /^(.+),? (how (?:do (?:they|I)|does (?:he|she|it)) work\??)/i,
  help: '<b>{things}</b>, how do they work?',
  url: 'http://i2.kym-cdn.com/photos/images/original/000/046/123/magnets.jpg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(.+?(?:a{3,}|e{3,}|i{3,}|o{3,}|u{3,}|y{3,}).*)/i,
  help: '{text}<b>{3 x a|e|i|o|u|y}</b>{text}',
  url: 'http://memecaptain.com/src_images/L50mqA',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(do you want .*) (because that'?s how .*)/i,
  help: 'do you want <b>{text}</b> because that\'s how <b>{text}</b>',
  url: 'http://cdn.meme.am/images/2021487.jpg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}];

exports.examples = matchers.map(function (matcher) {
  return '/meme ' + matcher.help;
});

exports.run = function *() {
  var message;
  var args = this.match[1];
  args = args ? args.trim() : null;
  if (args) {
    var match;
    var matcher;
    matchers.some(function (m) {
      matcher = m;
      match = matcher.pattern.exec(args);
      return !!match;
    });
    if (match) {
      for (var i in match) {
        this['$' + i] = match[i];
      }
      this.url = matcher.url;
      yield matcher.run;
    } else {
      yield this.html('Sorry, I didn\'t understand that');
    }
  } else {
    yield this.help();
  }
};

function generate(url, text1, text2) {
  return function *() {
    text1 = (text1 || '').trim();
    text2 = (text2 || '').trim();
    try {
      var response = yield request.get({
        url: 'http://memecaptain.com/g',
        json: true,
        qs: {
          u: url,
          t1: text1,
          t2: text2
        }
      });
      if (response.statusCode === 301) {
        yield generate(response.headers.location, text1, text2);
        return;
      }
      if (response.statusCode > 301) {
        yield this.fail();
        return;
      }
      var json = response.body;
      if (json && json.imageUrl) {
        yield this.text(json.imageUrl);
      } else {
        yield this.fail();
      }
    } catch (err) {
      yield this.text('Sorry, I can\'t connect to memecaptain.com right now.');
      logger.error('/meme connection error', err.message);
    }
  };
}
