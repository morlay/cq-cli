var command = require('../core/command');
var vlt = require('../core/cmd-vlt');
var path = require('path');
var db = require('../core/db');

module.exports = function () {

  if (command.argv.help || command.argv.h) {
    require('./help')('import');
    return;
  }

  importToJrc(command.getCommand(), command.argv.path);
};


function importToJrc(instanceName, targetPath) {

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
      'import',
      '-v',
      [instance.protocol, '://' , instance.host , ':', instance.port, '/crx'].join(''),
      '.'
    ],
    path.join(process.cwd(), '.sync', targetPath)
  );

  console.log(path.join(process.cwd(), '.sync', targetPath));
}