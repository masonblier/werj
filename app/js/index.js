//= require vendor/three
//= require vendor/ammo
//= require vendor/physi
//= require_tree lib
//= require_tree entities
//= require_tree systems
//= require_tree data
//= require game

+function(){

var app = window.app = {};

app.start = function(){
  Window.init();

  var gv = new GameView();
  gv.render(document.getElementById('container'));
};

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    app.start();
  }
};

}();
