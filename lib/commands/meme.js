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
  url: 'NryNmg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^aliens? guy (.+)/i,
  help: 'aliens guy <b>{text}</b>',
  url: 'sO-Hng',
  run: function *() {
    yield generate(this.url, '', this.$1);
  }
}, {
  pattern: /^((?:prepare|brace) (?:yourself|yourselves)) (.+)/i,
  help: 'brace yourself <b>{text}</b>',
  url: '_I74XA',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(.*) (all the .*)/i,
  help: '<b>{text}</b> all the <b>{things}</b>',
  url: 'Dv99KQ',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(i don'?t (?:always|normally) .*) (but when i do,? .*)/i,
  help: 'I don\'t always <b>{something}</b> but when I do <b>{text}</b>',
  url: 'V8QnRQ',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(.*) (\w+\stoo damn .*)/i,
  help: '<b>{text}</b> too damn <b>{something}</b>',
  url: 'RCkv6Q',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(not sure if .*) (or .*)/i,
  help: 'not sure if <b>{something}</b> or <b>{something else}</b>',
  url: 'CsNF8w',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(yo dawg,? .*) (so .*)/i,
  help: 'yo dawg <b>{text}</b> so <b>{text}</b>',
  url: 'Yqk_kg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(all your .*) (are belong to .*)/i,
  help: 'all your <b>{text}</b> are belong to <b>{text}</b>',
  url: '76CAvA',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(one does not simply) (.*)/i,
  help: 'one does not simply <b>{text}</b>',
  url: 'da2i4A',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(if you .*\s)(.* gonna have a bad time)/i,
  help: 'if you <b>{text}</b> gonna have a bad time',
  url: 'lfSVJw',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(if .*), ((?:are|can|do|does|how|is|may|might|should|then|what|when|where|which|who|why|will|won't|would) .*)/i,
  help: 'if <b>{text}</b>, <b>{word that can start a question}</b> <b>{text}</b>?',
  url: '-kFVmQ',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^((?:how|what|when|where|who|why) the (?:hell|heck|fuck|shit|crap|damn)) (.*)/i,
  help: '<b>{word that can start a question}</b> the <b>{expletive}</b> <b>{text}</b>',
  url: 'z8IPtw',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(?:success|nailed it) when (.*) then (.*)/i,
  help: 'success when <b>{text}</b> then <b>{text}</b>',
  url: 'AbNPRQ',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(?:fwp|cry) when (.*) then (.*)/i,
  help: 'cry when <b>{text}</b> then <b>{text}</b>',
  url: 'QZZvlg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^bad luck when (.*) then (.*)/i,
  help: 'bad luck when <b>{text}</b> then <b>{text}</b>',
  url: 'zl3tgg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^scumbag(?: steve)? (.*) then (.*)/i,
  help: 'scumbag <b>{text}</b> then <b>{text}</b>',
  url: 'RieD4g',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(what if i told you) (.+)/i,
  help: 'what if I told you <b>{text}</b>',
  url: 'fWle1w',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(i hate) (.+)/i,
  help: 'I hate <b>{text}</b>',
  url: '_k6JVg',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(why can'?t (?:i|we|you|he|she|it|they)) (.+)/i,
  help: 'why can\'t <b>{personal pronoun}</b> <b>{text}</b>',
  url: 'gdNXmQ',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(.+),? (so i(?:(?:(?:'?ve)? got)|(?: have)) that going for me(?:,? which is nice)?)/i,
  help: '<b>{text}</b> so I got that going for me',
  url: 'h9ct5g',
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
  url: '3V6rYA',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(.+?(?:a{3,}|e{3,}|i{3,}|o{3,}|u{3,}|y{3,}).*)/i,
  help: '{text}<b>{3 x a|e|i|o|u|y}</b>{text}',
  url: 'L50mqA',
  run: function *() {
    yield generate(this.url, this.$1, this.$2);
  }
}, {
  pattern: /^(do you want .*) (because that'?s how .*)/i,
  help: 'do you want <b>{text}</b> because that\'s how <b>{text}</b>',
  url: 'bxgxOg',
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
  function apiError(msg, json) {
    logger.error('/meme api error:', msg, json ? JSON.stringify(json) : '');
    return 'Sorry, the memecaptain.com API appears to be unavailable';
  }
  return function *() {
    var sourceImageId;
    if (url.match(/^https?:\/\//i)) {
      var response = yield request.post({
        url: 'http://memecaptain.com/src_images',
        json: true,
        body: { url: url },
      });
      var code = response.statusCode;
      var json = response.body;
      if (code == 202) {
        sourceImageId = json.id;
        var pollUrl = response.headers.location;
        // TODO: retry polling 10 times sleeping 1 second between each
        var pollResponse = yield request.get({ url: pollUrl });
        switch (pollResponse.statusCode) {
          case 200:
          case 303:
            break;
          default:
            yield this.text(apiError(
              'Unexpected response: ' + pollResponse.statusCode, pollResponse.body));
            return;
        }
      } else {
        yield this.text(apiError('Unexpected response: ' + code, json));
        return;
      }
    } else {
      sourceImageId = url;
    }
    text1 = (text1 || '').trim();
    text2 = (text2 || '').trim();
    try {
      var response = yield request.post({
        url: 'http://memecaptain.com/gend_images',
        json: true,
        body: {
          src_image_id: sourceImageId,
          captions_attributes: [
            {
              text: text1,
              top_left_x_pct: 0.05,
              top_left_y_pct: 0,
              width_pct: 0.9,
              height_pct: 0.25
            },
            {
              text: text2,
              top_left_x_pct: 0.05,
              top_left_y_pct: 0.75,
              width_pct: 0.9,
              height_pct: 0.25
            }
          ]
        }
      });
      var code = response.statusCode;
      var json = response.body;
      if (code == 202) {
        var pollUrl = response.headers.location;
        // TODO: retry polling 10 times sleeping 1 second between each
        var pollResponse = yield request.get({ url: pollUrl });
        switch (pollResponse.statusCode) {
          case 200:
            break;
          case 303:
            yield this.text(pollResponse.headers.location);
            break;
          default:
            yield this.text(apiError(
              'Unexpected response: ' + pollResponse.statusCode, pollResponse.body));
              return;
          }
      } else {
        yield this.text(apiError('Unexpected response: ' + code, json));
        return;
      }
    } catch (err) {
      yield this.text(apiError(err.message));
    }
  };
}
