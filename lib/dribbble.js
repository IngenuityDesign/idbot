var http = require('http'),
    url = require('url');

function dribbble() {
  return url.parse("http://api.dribbble.com/shots/everyone");
}

console.log('inspire');

module.exports.inspire = function(robot, next) {
  console.log('test');
  var href = dribbble();

  robot.http(href).get()(function(err,res,data) {
    if (err) {
      return next(err, null);
    }

    var returnImages = [];

    var response = JSON.parse(data);
    for (var x in response.shots) {
      returnImages.push(response.shots[x].image_url);
    }

    next(false,returnImages);
  });

}
