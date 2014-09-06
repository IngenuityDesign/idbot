// Description:
//   Ingenuity Design quality of life changes
//
// Dependencies:
//   s3, phantomjs
//
// Configuration:
//   None
//
// Commands:
//   hubot deploy <app>  - deploys <app> if it exists
//   is ebayinc done?  - tells you the truth
//   screenshot <webpage>  - takes a screenshot of <webpage> and uploads it to s3. Gives you the link
//   hubot inspire me  - inspires you with a designer's picture from dribbble

var urlUtil = require('url');
var screenshot = require('../lib/screenshot');
var inspire = require('../lib/dribbble');

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

    robot.respond(/inspire me/i, function(msg) {
      inspire.inspire(robot, function(err, images) {
        if (err) {
          msg.reply(err);
        } else {
          msg.reply(msg.random(images));
        }
      });
    });
}
