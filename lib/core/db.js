var localInstances = [
  {
    "name": "author",
    "protocol": "http",
    "host": "127.0.0.1",
    "port": "4502",
    "user": "admin",
    "password": "admin"
  },
  {
    "name": "publish",
    "protocol": "http",
    "host": "127.0.0.1",
    "port": "4503",
    "user": "admin",
    "password": "admin"
  }
];

var fse = require('fs-extra');

function getInstanceByName(instanceName) {

  var instances = fse.readJSONSync('./remotes.json').concat(localInstances).filter(function (project) {
    return project.name === instanceName;
  });

  if (instances.length === 0) {
    console.log('can not find the instance');
    return null;
  }

  return instances[0];

}

function getLocalInstance(instanceName) {

  var instances = localInstances.filter(function (project) {
    return project.name === instanceName;
  });

  if (instances.length === 0) {
    console.log('can not find the instance');
    return null;
  }

  return instances[0];

}

function getProjectByDefault() {
  var projects = fse.readJSONSync('./projects.json').filter(function (project) {
    return project.isDefault;
  });

  if (projects.length === 0) {
    console.log('no default project, please set one');
    return null;
  } else {
    return projects[0];
  }

}


module.exports = {
  localInstances: localInstances,
  getLocalInstance: getLocalInstance,
  getInstanceByName: getInstanceByName,
  getProjectByDefault: getProjectByDefault
};