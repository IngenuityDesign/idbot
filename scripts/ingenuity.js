// Description:
//   holiday detector script
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot is it weekend ?  - returns whether is it weekend or not
//   hubot is it holiday ?  - returns whether is it holiday or not

var urlUtil = require('url');
var screenshot = require('../lib/screenshot');

var apps = {
  paypalfirst: function(msg,robot) {
    msg.reply("Done deploying paypalfirst. Enjoy your shiny new software.")
  }
}

module.exports = function(robot) {
    robot.respond(/deploy ([^ ]+)/i, function(msg){
        var application = msg.match[1];
        if (apps[application]) {
          msg.reply("Deploying " + application + ". If it breaks it's still your fault.");
          apps[application](msg,robot);
        } else {
          msg.reply("That app doesn't exist!");
        }

    });

    robot.hear(/is ebayinc done( yet)?/i, function(msg) {
      msg.reply("Nope. Never");
    });

    robot.hear(/screenshot (.*)/i, function(msg) {

      var url = urlUtil.parse(msg.match[1]);

      if (!url.protocol) {
        url.protocol = "http:";
        url.slashes = true;
      }

      var urlHref = urlUtil.format(url);

      screenshot.toS3(urlHref, function(err,data) {
        if (err) {
          msg.reply(err);
        } else {
          msg.reply(data);
        }
      });

    });
}
