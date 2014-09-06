var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs')
var binPath = phantomjs.path

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

var rasterizeScript = path.join(path.dirname(__dirname), 'sh/phantomjs-screenshot.js');

module.exports.toS3 = function(url,next) {
  
  var childArgs = [
    rasterizeScript,
    url,
    'data/tmp.png',
    '1300px'
  ];

  childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
    // handle results
    if (err || stderr) {
      return next("Problem running script. Check your URL: " + url, null);
    }

    var filename = Math.floor(Math.random() * 1000000 ) + ".png";

    var params = {
      localFile: "data/tmp.png",

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
      next("Couldn't upload the screenshot.", null);
    });

    uploader.on('progress', function() {
      //console.log("progress", uploader.progressMd5Amount,
      //          uploader.progressAmount, uploader.progressTotal);
    });

    uploader.on('end', function() {
      next(false, s3.getPublicUrlHttp(params.s3Params.Bucket, params.s3Params.Key));
    });
  })

};
