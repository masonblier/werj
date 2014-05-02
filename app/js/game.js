+function(){

Physijs.scripts.worker = '/js/vendor/physijs_worker.js';
Physijs.scripts.ammo = '/js/vendor/ammo.js';

var VIEW_ANGLE = 45;
var NEAR = 0.1, FAR = 10000;

function GameView(){
  this.init();
}
window.GameView = GameView;


GameView.prototype.init = function(){
  this.renderer = new THREE.WebGLRenderer({antialias: true});
  this.scene = new Physijs.Scene();

  // this.scene.reportsize(100);
  // this.scene.setFixedTimeStep(1/30);
  this.scene.setGravity(V3(0,-20,0));

  Material.anisotropy = this.renderer.getMaxAnisotropy();

  this.camera = new THREE.PerspectiveCamera(
    VIEW_ANGLE, 10/16, NEAR, FAR
  );

  var al = new THREE.AmbientLight(0x101010);
  this.scene.add(al);
};

GameView.prototype.render = function($el){
  this.$el = $el;
  this.$el.appendChild(this.renderer.domElement);

  window.addEventListener('resize', this.resize.bind(this), false);
  this.resize();

  this.load();
};

GameView.prototype.load = function(){
  this.level = new Level(this.scene);
  this.level.load(TestLevel);

  Audio.load();

  this.player = new Player({
    camera:this.camera,
    spawn: this.level.spawn
  });
  this.scene.add(this.player);
  this.scene.addEventListener("ready", function(){
    this.player.setup();
  }.bind(this));
  this.scene.addEventListener("update", function(){
    this.player.clamp();
    Trigger.update();
  }.bind(this));

  this.setupStats();
  this.setupGameLoop();
};

GameView.prototype.setupStats = function(){
  this.stats = new Stats();
  this.stats.domElement.style.position = 'absolute';
  this.stats.domElement.style.top = '0px';
  this.stats.domElement.style.zIndex = 100;
  this.$el.appendChild(this.stats.domElement);
};

GameView.prototype.setupGameLoop = function(){
  var _this = this;
  var _paused = true;

  var $pauseOverlay = document.createElement('div');
  $pauseOverlay.className = 'pause-overlay';
  $pauseOverlay.innerHTML = '<div class="pause-message">paused</div>';
  this.$el.appendChild($pauseOverlay);

  var lt = -1;
  function _draw(t){
    if (_paused) return;
    if (lt===-1) lt = t;

    _this.player.update();
    _this.scene.simulate();

    _this.renderer.render(_this.scene, _this.camera);
    _this.stats.update();

    if (_this.player.position.y < -50) {
      _this.player.respawn();
    }

    requestAnimationFrame(_draw);
    lt = t;
  }
  this.pause = function(){
    _paused = true;
    $pauseOverlay.style.display = "block";
    lt = -1;
  };
  this.resume = function(){
    _paused = false;
    $pauseOverlay.style.display = "none";
    requestAnimationFrame(_draw);
  };
  Mouse.onpointerlockchange = function(locked){
    if (locked) {
      _this.resume();
    } else {
      _this.pause();
    }
  };
};

GameView.prototype.resize = function(){
  var WIDTH = this.$el.clientWidth;
  var HEIGHT = this.$el.clientHeight;

  this.camera.aspect = WIDTH / HEIGHT;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(WIDTH, HEIGHT);
};

}();
