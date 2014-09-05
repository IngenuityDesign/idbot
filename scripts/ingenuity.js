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
      var path = require('path')
      var childProcess = require('child_process')
      var phantomjs = require('phantomjs')
      var binPath = phantomjs.path

      var childArgs = [
        path.join(__dirname, 'phantomjs-script.js'),
        'some other argument (passed to phantomjs script)'
      ]

      childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        // handle results
        msg.reply(stdout);
      })
    });
}
