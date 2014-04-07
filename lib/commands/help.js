var commands = [
  {
    usage: 'CQ_ENV_PATH=PATH/TO/cq-env/ cq init',
    desc: 'Interactively create CQ workflow structure.'
  },
  {
    usage: 'cq doctor',
    desc: 'Check local development environment.'
  },
  {
    group: 'project',
    usage: 'cq project(pj) add',
    desc: 'Add a cq project by a guide'
  },
  {
    group: 'project',
    usage: 'cq project(pj) default <project-name>',
    desc: 'Set default cq project by project-name'
  },
  {
    group: 'project',
    usage: 'cq project(pj) remove(rm) <project-name>',
    desc: 'Remove cq project by project-name'
  },
  {
    group: 'project',
    usage: 'cq project(pj) list(ls)',
    desc: 'List your cq projects'
  },
  {
    group: 'remote',
    usage: 'cq remote add',
    desc: 'Add a remote cq instance by a guide'
  },
  {
    group: 'remote',
    usage: 'cq remote remove(rm) <instance-name>',
    desc: 'Remove remote cq instance by instance-name'
  },
  {
    group: 'remote',
    usage: 'cq remote list(ls)',
    desc: 'List your cq instances'
  },
  {
    group: 'local',
    usage: 'cq local server <local-instance-name:author|publish>',
    desc: 'Start server for local instances'
  },
  {
    group: 'local',
    usage: 'cq local sync <local-instance-name:author|publish>',
    desc: 'Start sync default project with local instance'
  },
  {
    group: 'local',
    usage: 'cq local unsync <local-instance-name:author|publish>',
    desc: 'End sync default project with local instance'
  },
  {
    group: 'import',
    usage: 'cq import <dest-instance-name> [--path <jcr-absulute-path>]',
    desc: 'Import default project (or by path url) ** TO ** target cq instance.'
  },
  {
    group: 'export',
    usage: 'cq export <src-instance-name> [--path <jcr-absulute-path>]',
    desc: 'Export default project (or by path url) ** FROM ** target cq instance.'
  },
  {
    group: 'rcp',
    usage: 'cq rcp <src-instance-name> <dest-instance-name> [--path <jcr-absulute-path>]',
    desc: 'list your cq instances'
  }
];

var chalk = require('chalk');
var command = require('../core/command');

module.exports = function (subCommandVar) {

  var subCommand = command.getCommand() || subCommandVar;

  if (subCommand) {
    var cmds = commands.filter(function (item) {
      return item.group === subCommand;
    });

    if (cmds.length) {
      commands = cmds;
    }
  }

  console.log('\n' + fillStringToLength('=', 20, '=') + '  CQ CLI Help  ' + fillStringToLength('=', 125, '=') + '\n');

  commands.forEach(function (cmd) {
    console.log('  ' + chalk.blue(fillStringToLength(cmd.usage, 80, ' ')), chalk.white('    -- ' + cmd.desc));
  });

  console.log('\n' + fillStringToLength('=', 160, '=') + '\n');

  function fillStringToLength(usage, length, char) {
    var tempArr = usage.split('');
    var len = length - tempArr.length;
    if (len > 0) {
      while (len--) {
        tempArr.push(char);
      }
    }
    return tempArr.join('');
  }

};