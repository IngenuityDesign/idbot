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

var s3 = require('s3');

var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_ACCESS_SECRET,
    // any other options are passed to new AWS.S3()
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  },
});

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
        path.join(path.dirname(__dirname), 'sh/phantomjs-screenshot.js'),
        'http://google.com/',
        'sh/test.png'
      ]

      childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        // handle results
        if (stderr) {

        }
        var filename = Math.floor(Math.random() * 1000000 ) + ".png";

        var params = {
          localFile: "sh/test.png",

          s3Params: {
            ACL: 'public-read',
            Bucket: "idbot",
            Key: filename,
            // other options supported by putObject, except Body and ContentLength.
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
          },
        };
        var uploader = client.uploadFile(params);
        uploader.on('error', function(err) {
          msg.reply("Couldn't upload the screenshot.")
        });

        uploader.on('progress', function() {
          //console.log("progress", uploader.progressMd5Amount,
          //          uploader.progressAmount, uploader.progressTotal);
        });

        uploader.on('end', function() {
          msg.reply(s3.getPublicUrlHttp(params.s3Params.Bucket, params.s3Params.Key));
        });
      })
    });
}
