var chalk = require('chalk');
var command = require('../core/command');
var fse = require('fs-extra');
var path = require('path');
var prompt = require('prompt');

module.exports = function () {

  var projects = fse.readJSONSync('./projects.json');


  if (command.argv.help || command.argv.h) {
    require('./help')('project');
    return;
  }

  switch (command.getCommand()) {
    case 'list':
    case 'ls':
      projectList(projects);
      break;
    case 'add':
      projectAdd(projects);
      break;
    case 'remove':
    case 'rm':
      projectRemove(projects, command.getCommand());
      break;
    case 'default':
      projectDefault(projects, command.getCommand());
      break;
    default:
      console.log('\n' + chalk.red('Error Command'));
      require('./help')('project');
  }
};

function updateJSON(projects) {
  fse.writeJSONSync('./projects.json', projects);
}

function queryProject(projects, projectName) {
  var index = -1;
  projects.forEach(function (project, idx) {

    if (project.name == projectName) {
      index = idx;
    }
  });
  return index;
}

function projectAdd(projects) {

  var schema = {
    properties: {
      name: {
        type: 'string',
        description: "Your project path name ?",
        required: true,
        default: 'test',
        message: 'Bad project name or May have added the project',
        conform: function (name) {
          return (queryProject(projects, name) < 0)
        }
      },
      content: {
        type: 'string',
        default: 'test-home',
        description: "Your project content path name ?",
        required: true
      }
    }
  };

  prompt.message = '[' + '?'.green + ']';
  prompt.delimiter = ' '.white;
  prompt.override = command.argv;

  prompt.start();

  prompt.get(schema, function (err, result) {

    console.log('Project Add Success!');
    result.isDefault = !projects.length;
    projects.push(result);
    updateJSON(projects);
    projectList(projects);

  });
}

function projectDefault(projects, projectName) {
  if (queryProject(projects, projectName) > -1) {

    projects.forEach(function (project) {
      project.isDefault = (project.name === projectName);
    });

    updateJSON(projects);

  } else {
    console.log('\nCan not find the project.\n');
  }
  projectList(projects);
}

function projectRemove(projects, projectName) {
  var idx = queryProject(projects, projectName);
  if (idx > -1) {

    var isDefault = projects[idx].isDefault;
    projects.splice(idx, 1);

    if (isDefault && projects.length > 0) {
      projects[0].isDefault = true;
    }

    updateJSON(projects);

  } else {
    console.log('\nCan not find the project.\n');
  }
  projectList(projects);
}

function projectList(projects) {
  console.log('======== Projects ========');
  projects.forEach(function (project) {
    console.log(chalk.red(project.isDefault ? '*' : '-'), chalk.blue(project.name), project.content);
  });
  console.log('==========================');
}