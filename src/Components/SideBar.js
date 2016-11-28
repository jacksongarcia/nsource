
module.exports = function () {


  var SideBarController = {

    insertOther: function (name) {
      var others = document.querySelector('#sidebar-others')
      others.insertAdjacentHTML('beforeend',
        '<span id="other-'+name+'" class="nav-group-item">'+
          '<span class="icon icon-monitor"></span>' +
          name +
        '</span>')
    },

    removeOther: function (name) {
      var others = document.querySelector('#sidebar-others')
      var id = document.getElementById('other-'+name)
      others.removeChild(id)
    }
  }

  return SideBarController
}
