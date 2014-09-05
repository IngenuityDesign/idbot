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
    })
}
