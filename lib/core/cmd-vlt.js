var cp = require('child_process');
var path = require('path');
var Q = require('q');

module.exports = function(args, cwd) {

  process.env['JAVA_HOME'] = path.join(process.cwd(), require('../../package.json')['JAVA_HOME']);
  process.env['VLT_HOME'] = path.join(process.cwd(), require('../../package.json')['VLT_HOME']);

  var deferred = Q.defer();

  var vlt = cp.spawn(path.join(process.env['VLT_HOME'], 'bin/vlt'), args, {
    cwd: cwd,
    env: process.env
  });

  vlt.stdout.on('data', function(data) {
    console.log(String(data));
  });

  vlt.stderr.on('data', function(data) {
    console.log(String(data));
  });

  vlt.on('close', function(code) {
    console.log('child process exited with code ' + code);
    deferred.resolve();
  });

  return deferred.promise;

};
