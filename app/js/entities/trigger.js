+function(){

Trigger._active = [];

function Trigger(opts){
  this.level = opts.level;

  var geo = new THREE.CubeGeometry(
    opts.geometry.width,
    opts.geometry.height,
    opts.geometry.depth
  );
  var mat = this.level.loadMaterial('trigger');
  Physijs.BoxMesh.call(this, geo, mat, 0);

  this._physijs.collision_flags = 4;
  this.addEventListener('collision', function(target){
    if (target.isPlayer) {
      this.material = this.level.loadMaterial('triggered');
      Trigger._active.push({trigger:this, targetId:target._physijs.id});
      Trigger.dispatchEvent({type:opts['event']})
    }
  });

  this.position = V3.fromArray(opts.position);
}

window.Trigger = Trigger;
util.extends(Trigger, Physijs.BoxMesh);

THREE.EventDispatcher.prototype.apply(Trigger);

Trigger.prototype.isTrigger = true;

Trigger.update = function(){
  var ui = Trigger._active.length;
  var t = null;
  while (--ui >= 0) {
    t = Trigger._active[ui];
    if (t.trigger._physijs.touches.indexOf(t.targetId)===-1) {
      Trigger._active.splice(ui, 1);
      t.trigger.material = t.trigger.level.loadMaterial('trigger');
    }
  }
};

}();
