//= require key

+function(){

var Mouse = window.Mouse = {};

Mouse.onmove = null;
Mouse.onpointerlockchange = null;

Mouse.pointerLockChange = function(e){
  var pointerLockElem = document.mozPointerLockElement||document.webkitPointerLockElement;
  if (pointerLockElem === Mouse.pointerElem) {
    Mouse.listen();
    if (Mouse.onpointerlockchange) Mouse.onpointerlockchange(true);
  } else {
    Mouse.removeListeners();
    if (Mouse.onpointerlockchange) Mouse.onpointerlockchange(false);
  }
};

Mouse.pointerLockError = function(e) {
  console.log("Pointer lock error.", e)
};

Mouse.move = function(e){
  if (Mouse.onmove) {
    Mouse.onmove({
      x: e.movementX||e.mozMovementX||e.webkitMovementX||0,
      y: e.movementY||e.mozMovementY||e.webkitMovementY||0
    });
  }
};

Mouse.contextMenu = function(e){
  e.preventDefault();
};

Mouse.requestPointerLock = function(){
  Mouse.pointerElem = document.getElementById("container");
  Mouse.pointerElem.requestPointerLock = Mouse.pointerElem.requestPointerLock||
                                          Mouse.pointerElem.mozRequestPointerLock||
                                          Mouse.pointerElem.webkitRequestPointerLock;
  Mouse.pointerElem.requestPointerLock();
};

Mouse.init = function(){
  document.addEventListener('pointerlockchange', Mouse.pointerLockChange, false);
  document.addEventListener('mozpointerlockchange', Mouse.pointerLockChange, false);
  document.addEventListener('webkitpointerlockchange', Mouse.pointerLockChange, false);

  document.addEventListener('pointerlockerror', Mouse.pointerLockError, false);
  document.addEventListener('mozpointerlockerror', Mouse.pointerLockError, false);
  document.addEventListener('webkitpointerlockerror', Mouse.pointerLockError, false);
};

Mouse.listen = function(){
  Key.listen();
  document.addEventListener('contextmenu', Mouse.contextMenu, false);
  document.addEventListener('mousemove', Mouse.move, false);
};

Mouse.removeListeners = function(){
  Key.removeListeners();
  document.removeEventListener('contextmenu', Mouse.contextMenu);
  document.removeEventListener('mousemove', Mouse.move);
};

}();
