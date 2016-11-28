const exec      = require('child_process').exec
const {dialog}  =  require('electron').remote;

module.exports = function () {
  var ret = false

  var GitController = {
    initGit: function (path) {
      return exec('git init ' + path, (error, stdout, stderr) => {
        if (error != null) {
          dialog.showErrorBox("Erro ao criar repositório", stdout)
          returfalse
        } else {
          return true
        }
      })
    }
  }

  return GitController
}
