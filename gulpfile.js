const GulpClient = require("gulp");

const { src, dest } = require("gulp");

function defaultTask(cb) {
  cb();
}

exports.default = defaultTask;
