var cp = require('child_process');
var path = require('path');

module.exports = function (args, cwd) {

  var tar = cp.spawn('tar', args, {
    cwd: cwd,
    env: process.env
  });

  tar.stdout.on('data', function (data) {
    console.log(String(data));
  });

  tar.stderr.on('data', function (data) {
    console.log(String(data));
  });

};