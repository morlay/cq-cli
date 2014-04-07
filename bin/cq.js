var command = require('../lib/core/command');

switch (command.getCommand()) {
  case 'init':
    require('../lib/commands/init')();
    break;
  case 'project':
  case 'pj':
    require('../lib/commands/project')();
    break;
  case 'remote':
    require('../lib/commands/remote')();
    break;
  case 'local':
    require('../lib/commands/local')();
    break;
  case 'import':
    require('../lib/commands/import')();
    break;
  case 'export':
    require('../lib/commands/export')();
    break;
  case 'rcp':
    require('../lib/commands/rcp')();
    break;
  case 'help':
  default:
    require('../lib/commands/help')();
}
