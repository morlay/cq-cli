var chalk = require('chalk');
var command = require('../core/command');
var vlt = require('../core/cmd-vlt');
var db = require('../core/db');
var path = require('path');

module.exports = function () {
  if (command.argv.help || command.argv.h) {
    require('./help')('export');
    return;
  }

  exportFromJrc(command.getCommand(), command.argv.path);
};


function exportFromJrc(instanceName, targetPath) {

  var project = db.getProjectByDefault();
  var instance = db.getInstanceByName(instanceName);

  if (!project || !instance) {
    return;
  }

  if (targetPath) {
    console.log(targetPath);
  } else {
    targetPath = '/apps/' + project.name;
  }

  vlt([
      '--credentials',
      [instance.user, instance.password].join(':'),
      'export',
      '-v',
      [instance.protocol, '://' , instance.host , ':', instance.port, '/crx'].join(''),
      targetPath, '.' + targetPath
    ],
    path.join(process.cwd(), '.sync')
  );
}