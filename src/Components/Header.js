const { remote }  = require('electron')
const {app}       = require('electron').remote
const {dialog}    =  require('electron').remote;
const path        = require('path')
const fs          = require('fs')
const GitController = require('../GitController')
const SideBar       = require('./SideBar')
const Config        = require('../Config')

module.exports = function () {
  const git     = new GitController
  const sidebar = new SideBar
  const config  = new Config

  function isEmpty (str) {
    return (!str || 0 === str.length)
  }

  function isBlank (str) {
    return (!str || /^\s*$/.test(str))
  }

  function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function (file,index) {
        var curPath = path + "/" + file
        if(fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath)
        } else { // delete file
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(path)
    }
  }

  var HeaderController = {

    initEventTop: function () {
      document.getElementById('minimizar').addEventListener('click', () =>
        remote.BrowserWindow.getFocusedWindow().minimize()
      )

      document.getElementById('maximinizar').addEventListener('click', () =>
        {if (remote.BrowserWindow.getFocusedWindow().isMaximized()) {
          remote.BrowserWindow.getFocusedWindow().restore()
          document.getElementById('maxAndMin').setAttribute('class', 'icon icon-resize-full')
        } else {
          remote.BrowserWindow.getFocusedWindow().maximize()
          document.getElementById('maxAndMin').setAttribute('class', 'icon icon-resize-small')
        }}
      )

      document.getElementById('fechar').addEventListener('click', () =>
        remote.BrowserWindow.getFocusedWindow().close()
      )
    },

    create: function () {
      var viewCreate = false

      document.getElementById('create-repository').addEventListener('click', () => {
        if (viewCreate) {
          document.getElementById('header-create').style.display = 'none'
          document.getElementById('input-path-create').value = app.getPath('documents')
          document.getElementById('span-error-create').innerHTML = ''
          viewCreate = false
        } else {
          document.getElementById('header-create').style.display = 'block'
          document.getElementById('input-path-create').value = app.getPath('documents')
          document.getElementById('input-name-create').setAttribute('autofocus', 'true')
          viewCreate = true
        }
      })

      document.getElementById('selected-directory').addEventListener('click', () => {
        dialog.showOpenDialog({
          properties: [
            'openFile',
            'openDirectory',
          ],
          defaultPath: app.getPath('documents'),
          title: 'NSource: selecione a pasta',
          buttonLabel: 'Adicionar'
        }, function(directory){
          if (directory)
            document.getElementById('input-path-create').value = directory
        })
      })

      document.getElementById('button-create-repository').addEventListener('click', () => {
        const inputName = document.getElementById('input-name-create').value
        if (!isEmpty(inputName) && !isBlank(inputName)) {
          const pathFull = path.join(document.getElementById('input-path-create').value, inputName)

          fs.mkdir(pathFull, (err) => {
            if (err) {
              dialog.showErrorBox("Erro ao criar repositório", err.message)
            } else {
              document.getElementById('header-create').style.display = 'none'
              document.getElementById('input-name-create').value = ''

              if (git.initGit(pathFull)) {
                console.log('Criado com sucesso!')
                sidebar.insertOther(inputName)
                config.saveRepository(pathFull, inputName)
              } else {
                setTimeout(function(){deleteFolderRecursive(pathFull)}, 3000)
              }
            }
          })
        } else {
          document.getElementById('span-error-create').innerHTML = '(*) Por favor entre com o nome do repositório'
        }
      })
    }
  }

  return HeaderController
}
