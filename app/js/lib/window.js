//= require mouse

+function(){

var FULLSCREEN = false;

var Window = window.Window = {};

Window.fullscreenChange = function() {

  if (document.webkitFullscreenElement === Window.fsElem ||
      document.mozFullscreenElement === Window.fsElem) {

    Mouse.requestPointerLock();

  }

};

Window.init = function(){
  Window.fsElem = document.getElementById("container");
  Window.fsElem.addEventListener('click', function(){
    Window.listen();
  });
};

Window.listen = function(){
  Mouse.init();

  if (FULLSCREEN) {

    document.addEventListener('fullscreenchange', Window.fullscreenChange, false);
    document.addEventListener('mozfullscreenchange', Window.fullscreenChange, false);
    document.addEventListener('webkitfullscreenchange', Window.fullscreenChange, false);

    Window.fsElem.requestFullscreen = Window.fsElem.requestFullscreen||
                                            Window.fsElem.mozRequestFullscreen||
                                            Window.fsElem.webkitRequestFullscreen;
    Window.fsElem.requestFullscreen();

  } else {

    Mouse.requestPointerLock();

  }

};

}();
