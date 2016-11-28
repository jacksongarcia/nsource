const fs      = require('fs')
const SideBar = require('./Components/SideBar')

module.exports = function () {
  const sideBar = new SideBar

  var Config = {
    loadRepository: function () {
      fs.readFile('./config/configRepositorys.json', {encoding: "utf8"}, (err, data) => {
        if (err) {
          dialog.showErrorBox("Erro ao carregar respoitórios")
        }

        // console.log(JSON.parse(data)['name'])
        sideBar.insertOther(JSON.parse(data)['name'])
      })
    },

    saveRepository: function (path, name) {
      var json = {
        "name": name,
        "path": path
      }

      fs.writeFile("./config/configRepositorys.json", JSON.stringify(json), function(err){
        if (err) {
          dialog.showErrorBox("Erro ao salvar respoitórios")
        }
        // console.log("Ficheiro salvo");
      })
    }
  }

  return Config
}
