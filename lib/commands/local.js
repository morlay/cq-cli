var chalk = require('chalk');
var command = require('../core/command');
var java = require('../core/cmd-java');
var vlt = require('../core/cmd-vlt');
var db = require('../core/db');
var path = require('path');

module.exports = function () {

  if (command.argv.help || command.argv.h) {
    require('./help')('local');
    return;
  }

  switch (command.getCommand()) {
    case 'server':
    case 'serve':
      localServerStart(command.getCommand());
      break;
    case 'sync':
      syncStart(command.getCommand());
      break;
    case 'unsync':
      syncEnd(command.getCommand());
      break;
    default:
      console.log('\n' + chalk.red('Error Command'));
      require('./help')('local');
  }
};


function syncStart(instanceName) {

  var project = db.getProjectByDefault();
  var instance = db.getLocalInstance(instanceName);

  if (!instance) {
    return;
  }

  vlt(['--credentials',
      [instance.user, instance.password].join(':'),
      'sync',
      '--uri',
      [instance.protocol, '://' , instance.host , ':', instance.port, '/crx'].join(''),
      'install',
      '--force'],
    path.join(process.cwd(), '.sync')
  )
    .then(function () {

      vlt(['--credentials',
          [instance.user, instance.password].join(':'),
          'sync',
          '--uri',
          [instance.protocol, '://' , instance.host , ':', instance.port, '/crx'].join(''),
        ],
        path.join(process.cwd(), '.sync', 'apps', project.name, 'jcr_root')
      );

    });

}

function syncEnd(instanceName) {

  var project = db.getProjectByDefault();
  var instance = db.getLocalInstance(instanceName);

  if (!instance) {
    return;
  }

  vlt(['--credentials',
      [instance.user, instance.password].join(':'),
      'sync',
      'unregister',
      '--uri',
      [instance.protocol, '://' , instance.host , ':', instance.port, '/crx'].join(''),
    ],
    path.join(process.cwd(), '.sync', 'apps', project.name, 'jcr_root')
  );
}


function localServerStart(instanceName) {

  if (['author', 'publish'].indexOf(instanceName) < 0) {
    console.log('\n' + 'You can only use ' + chalk.red('author') + ' or ' + chalk.red('publish') + ' for the instance name \n');
    return false;
  }

  var instances = {
    author: {
      file: 'cq-author-p4502.jar',
      path: '.cq/author'
    },
    publish: {
      file: 'cq-publish-p4503.jar',
      path: '.cq/publish'
    }
  };

  java([
    '-XX:MaxPermSize=256m',
    '-Xmx1024M',
    '-jar',
    instances[instanceName].file
  ], path.join(process.cwd(), instances[instanceName].path));

}
