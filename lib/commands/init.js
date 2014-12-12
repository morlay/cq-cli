var vfs = require('vinyl-fs');
var fse = require('fs-extra');
var path = require('path');
var gunzip = require('gulp-gunzip');
var untar = require('gulp-untar2');
var unzip = require('gulp-unzip');
var rename = require('gulp-rename');
var chmod = require('gulp-chmod');
var del = require('del');

module.exports = init;

var CQ_ENV_PATH = !!process.env['CQ_ENV_PATH'] ? process.env['CQ_ENV_PATH'] : path.join(process.env['HOME'], '/Backup/cq-env/');

var files = require('../../package.json').cqEnv;

function init() {

  del('.cq', function() {
    fse.mkdirp('.sync');
    fse.mkdirp('src');

    console.log('cq initing...');

    vfs.src(path.join(CQ_ENV_PATH, files['cq']))
      .pipe(rename(function(pathObj) {
        pathObj.basename = 'cq-author-p4502';
      }))
      .pipe(vfs.dest('.cq/author'))
      .pipe(rename(function(pathObj) {
        pathObj.basename = 'cq-publish-p4503'
      }))
      .pipe(vfs.dest('.cq/publish'));

    vfs.src(path.join(CQ_ENV_PATH, files['license']))
      .pipe(vfs.dest('.cq/author'))
      .pipe(vfs.dest('.cq/publish'));

    vfs.src([
      path.join(CQ_ENV_PATH, files['jre'])
    ])
      .pipe(gunzip())
      .pipe(untar())
      .pipe(rename(function(pathObj) {
        pathObj.dirname = pathObj.dirname.replace(/(jre[^\/]+\/)/, 'jre/');
      }))
      .pipe(chmod(755))
      .pipe(vfs.dest('.cq'));

    vfs.src(path.join(CQ_ENV_PATH, files['vlt']))
      .pipe(unzip())
      .pipe(rename(function(pathObj) {
        pathObj.dirname = pathObj.dirname.replace(/(vault-cli[^\/]+\/)/, 'vlt/');
      }))
      .pipe(chmod(755))
      .pipe(vfs.dest('.cq'));
  });

  fse.writeJSONSync('./projects.json', []);
  fse.writeJSONSync('./remotes.json', []);

}

