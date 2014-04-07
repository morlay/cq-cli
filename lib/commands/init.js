var vfs = require('vinyl-fs');
var fse = require('fs-extra');
var es = require('event-stream');
var path = require('path');
var tar = require('../core/cmd-tar');

module.exports = init;

var CQ_ENV_PATH = !!process.env['CQ_ENV_PATH'] ? process.env['CQ_ENV_PATH'] : path.join(process.env['HOME'], '/Backup/cq-env/');

function init() {

  fse.mkdirp('.cq');
  fse.mkdirp('.sync');
  fse.mkdirp('src');

  console.log('cq initing...');

  vfs.src(path.join(CQ_ENV_PATH, 'cq5-author-p4502.jar'))
    .pipe(vfs.dest('.cq/author'));

  vfs.src(path.join(CQ_ENV_PATH, 'cq5-publish-p4503.jar'))
    .pipe(vfs.dest('.cq/publish'));

  vfs.src(path.join(CQ_ENV_PATH, 'license.properties'))
    .pipe(vfs.dest('.cq/author'))
    .pipe(vfs.dest('.cq/publish'));

  vfs.src([
    path.join(CQ_ENV_PATH, 'jre-7u51-macosx-x64.tar.gz'),
    path.join(CQ_ENV_PATH, 'filevault.tgz')
  ], {read: false})
    .pipe(es.map(function (file, callback) {
      tar(['-xf', file.path], path.join(process.cwd(), '.cq'));
      callback(null, file);
    }));

  fse.writeJSONSync('./projects.json', []);
  fse.writeJSONSync('./remotes.json', []);

}

