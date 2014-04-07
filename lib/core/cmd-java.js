var cp = require('child_process');
var path = require('path');

module.exports = function (args, cwd) {

  process.env['JAVA_HOME'] = path.join(process.cwd(), '.cq/jre1.7.0_51.jre/Contents/Home');

  var java = cp.spawn('java', args, {
    cwd: cwd,
    env: process.env
  });

  java.stdout.on('data', function (data) {
    console.log(String(data));
  });

  java.stderr.on('data', function (data) {
    console.log(String(data));
  });

};