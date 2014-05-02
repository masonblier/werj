+function(){

var PLAYER_RADIUS = 0.2;
var PLAYER_HEIGHT = 2;
var CAMERA_HEIGHT = 0.5;

var MOVE_FORCE = 100;
var JUMP_FORCE = 800;
var MOVE_AIR_FORCE = 20;
var MAX_SPEED = 5;
var WALK_DAMPING = 0.8;

var MOUSE_SPEED = 0.002;

function Player(opts){
  var geo = new THREE.CylinderGeometry(PLAYER_RADIUS, PLAYER_RADIUS, PLAYER_HEIGHT);
  var tmat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
  var mat = Physijs.createMaterial(tmat, 0.8, 0);

  Physijs.CylinderMesh.call(this, geo, mat, 100);

  this.visible = false;
  this.spawn = opts.spawn;
  this.camera = opts.camera;
  this.camera.rotation.set(0, 0, 0);

  this.po = new THREE.Object3D();
  this.po.add(this.camera);
  this.po.position.y = CAMERA_HEIGHT;
  this.po.rotation.x = 0;

  this.yo = new THREE.Object3D();
  this.yo.add(this.po);
  this.add(this.yo);

  this.position.copy(this.spawn);
  this.jumping = false;
  this.jumped = false;
  this._floors = [];

  Mouse.onmove = this.onmousemove.bind(this);

  this.addEventListener('ready', function(){
    this.setAngularFactor({x:0, y:0, z:0});
  }.bind(this));

  this.addEventListener('collision', function(target, mv, rv, ino){
    if (target.isTrigger) return;
    if (ino.y < -0.7 && this._floors.indexOf(target._physijs.id)) {
      this._floors.push(target._physijs.id);
    }
  });

  this.addEventListener('update', function(){
    console.log('updated')
  });
}
window.Player = Player;
util.extends(Player, Physijs.CapsuleMesh);

Player.prototype.isPlayer = true;

Player.prototype.setup = function(){
};

Player.prototype.onmousemove = function(d){
  this.yo.rotation.y -= d.x * MOUSE_SPEED;
  this.po.rotation.x -= d.y * MOUSE_SPEED;
  this.po.rotation.x = Math.max(-HALF_PI, Math.min(HALF_PI, this.po.rotation.x));
};

Player.prototype.respawn = function(){
  this.po.rotation.x = 0;
  this.yo.rotation.y = 0;

  this.setLinearVelocity(V3(0,0,0));
  this.position.copy(this.spawn);
  this.__dirtyPosition = true;
};

Player.prototype.onGround = function(){
  this._floors = this._floors.filter(function(f){
    return (this._physijs.touches.indexOf(f) !== -1);
  }.bind(this))
  return (this._floors.length > 0);
};

Player.prototype.getMoveVelocity = function(){
  var moveVelocity = V3(0,0,0);

  if (Key.isDown(Key.w)||Key.isDown(Key.up)) {
    moveVelocity.z -= 1;
  }
  if (Key.isDown(Key.a)||Key.isDown(Key.left)) {
    moveVelocity.x -= 1;
  }
  if (Key.isDown(Key.s)||Key.isDown(Key.down)) {
    moveVelocity.z += 1;
  }
  if (Key.isDown(Key.d)||Key.isDown(Key.right)) {
    moveVelocity.x += 1;
  }

  if (Key.isDown(Key.SPACE) && this.onGround() && !this.jumping) {
    this.jumping = true;
    moveVelocity.multiplyScalar(MOVE_FORCE);
    moveVelocity.y = JUMP_FORCE;
  } else {
    if (this.jumping && !Key.isDown(Key.SPACE)) {
      this.jumping = false;
      this.jumped = false;
    }
    if (this.onGround()&&!this.jumping) {
      moveVelocity.multiplyScalar(MOVE_FORCE);
    } else {
      moveVelocity.multiply(V3(MOVE_AIR_FORCE, 1, 0));
    }
  }

  moveVelocity.applyEuler(this.yo.rotation);
  return moveVelocity;
};

Player.prototype.update = function(){
  this.applyCentralImpulse(this.getMoveVelocity());
};

Player.prototype.clamp = function(){
  if (this.onGround()) {
    if (this.jumping && !this.jumped) {
      this.jumped = true;

      if (this.walking) {
        this.walking = false;
        Audio.stop('walking');
      }

      Audio.play('jump');

    } else {

      var elv = this.getLinearVelocity().clone();

      if (elv.length() > MAX_SPEED) {
        elv.normalize().multiplyScalar(MAX_SPEED);
      }

      if (elv.length() > 0.6*MAX_SPEED) {
        if (!this.walking) {
          this.walking = true;
          Audio.start('walking');
        }
      }
      if (elv.length() < 0.3*MAX_SPEED) {
        if (this.walking) {
          this.walking = false;
          Audio.stop('walking');
        }
      }

      elv.multiplyScalar(WALK_DAMPING);
      this.setLinearVelocity(elv);

    }
  }
};

}();
