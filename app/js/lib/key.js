+function(){

var Key = window.Key = {
  _disabled: false,
  _pressed: {},
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,

  w: 87,
  a: 65,
  s: 83,
  d: 68,
};

Key.isDown = function(keyCode) {
  return !Key._disabled && Key._pressed[keyCode];
};

Key.onKeydown = function(e) {
  Key._pressed[e.keyCode] = true;
};

Key.onKeyup = function(e) {
  delete Key._pressed[e.keyCode];
};

Key.disableInput = function(){
  Key._disabled = true;
};

Key.enableInput = function(){
  Key._disabled = false;
};

Key.listen = function(){
  document.addEventListener('keyup', Key.onKeyup, false);
  document.addEventListener('keydown', Key.onKeydown, false);
};

Key.removeListeners = function(){
  document.removeEventListener('keyup', Key.onKeyup);
  document.removeEventListener('keydown', Key.onKeydown);
};

}();
