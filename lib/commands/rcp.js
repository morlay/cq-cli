var command = require('../core/command');
var vlt = require('../core/cmd-vlt');
var path = require('path');
var db = require('../core/db');

module.exports = function () {
  if (command.argv.help || command.argv.h) {
    require('./help')('rcp');
    return;
  }

  rcpFromToJrc(command.getCommand(), command.getCommand(), command.argv.path);
};


function rcpFromToJrc(srcInstanceName, destInstanceName, targetPath) {

  var project = db.getProjectByDefault();
  var srcInstance = db.getInstanceByName(srcInstanceName);
  var destInstance = db.getInstanceByName(destInstanceName);

  if (!project || !srcInstance || !destInstance) {
    return;
  }

  if (targetPath) {
    console.log(targetPath);
  } else {
    targetPath = '/content/' + project.content;
  }

  vlt(['rcp',
      '-u', // update
      '-n', // new file
      '-r', // recursive
      convertPathByHost(srcInstance),
      convertPathByHost(destInstance)
    ],
    path.join(process.cwd(), '.sync')
  );

  function convertPathByHost(host) {
    return [ host.protocol, '://', host.user, ':', host.password , '@', host.host , ':', host.port,
      '/crx/-/jcr:root', targetPath
    ].join('');
  };

}