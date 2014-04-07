module.exports = (new Command(require('yargs').argv));

function Command(argv) {
  this.argv = argv;
  this.commandQueue = argv._;
}

Command.prototype.getCommand = function () {
  var command = null;
  if (this.commandQueue.length) {
    command = this.commandQueue[0];
  }
  this.commandQueue.splice(0, 1);
  return command;
};