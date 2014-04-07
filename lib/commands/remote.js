var chalk = require('chalk');
var command = require('../core/command');
var fse = require('fs-extra');
var path = require('path');
var prompt = require('prompt');

module.exports = function () {

  var remotes = fse.readJSONSync('./remotes.json');


  if (command.argv.help || command.argv.h) {
    require('./help')('remote');
    return false;
  }

  switch (command.getCommand()) {
    case 'list':
    case 'ls':
      remoteList(remotes);
      break;
    case 'add':
      remoteAdd(remotes);
      break;
    case 'remove':
    case 'rm':
      remoteRemove(remotes, command.getCommand());
      break;
    default:
      console.log('\n' + chalk.red('Error Command'));
      require('./help')('remote');
  }
};

function updateJSON(remotes) {
  fse.writeJSONSync('./remotes.json', remotes);
}

function queryRemote(remotes, remoteName) {
  var index = -1;
  remotes.forEach(function (remote, idx) {

    if (remote.name == remoteName) {
      index = idx;
    }
  });
  return index;
}

function remoteAdd(remotes) {

  var schema = {
    properties: {
      name: {
        type: 'string',
        description: "Your remote path name ?",
        required: true,
        default: 'test',
        message: 'Bad remote instance name or May have added the remote instance',
        conform: function (name) {
          return (queryRemote(remotes, name) < 0)
        }
      },
      "protocol": {
        type: 'string',
        default: "http",
        required: true
      },
      "host": {
        type: 'string',
        default: "127.0.0.1",
        required: true
      },
      "port": {
        default: "4502",
        required: true
      },
      "user": {
        default: "admin",
        required: true
      },
      "password": {
        default: "admin",
        required: true
      }
    }
  };

  prompt.message = '[' + '?'.green + ']';
  prompt.delimiter = ' '.white;
  prompt.override = command.argv;

  prompt.start();

  prompt.get(schema, function (err, result) {

    console.log('remote Add Success!');
    remotes.push(result);
    updateJSON(remotes);
    remoteList(remotes);

  });
}

function remoteRemove(remotes, remoteName) {
  var idx = queryRemote(remotes, remoteName);
  if (idx > -1) {

    var isDefault = remotes[idx].isDefault;
    remotes.splice(idx, 1);

    if (isDefault && remotes.length > 0) {
      remotes[0].isDefault = true;
    }

    updateJSON(remotes);

  } else {
    console.log('\nCan not find the remote instance name.\n');
  }
  remoteList(remotes);
}

function remoteList(remotes) {
  console.log('========= remotes =========');
  remotes.forEach(function (remote) {
    console.log(chalk.red('-'), chalk.blue(remote.name) + ' ' + remote.protocol + '://' + remote.user + ':' + remote.password + '@'
      + remote.host + ':' + remote.port);
  });
  console.log('===========================');
}