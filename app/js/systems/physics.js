+function(){

function Physics(){
  THREE.Object3D.call(this);
}
util.extends(Physics, THREE.Object3D);
window.Physics = Physics;

Physics.update = function(dt){

  Component.getEntities("dynamic").forEach(function(e){
    var dc = e.components["dynamic"];
    var mc = e.components["move-controls"];

    if (mc) {
      var mv = (mc ? mc.getMoveVelocity() : V3(0,0,0));
      if (mc.jumping===1) {
        dc.velocity.add(V3(0,10,0));
        mc.jumping = 2;
      }
    }

    dc.applyForces(dt);

    var dp = V3(
      dt * (dc.velocity.x + mv.x),
      dt * (dc.velocity.y + mv.y),
      dt * (dc.velocity.z + mv.z)
    );

    var nbb = e.getBoundingBox().clone().translate(dp);
    var collisions = Physics.findCollisions(nbb);
    if (collisions.length > 0) {
      dc.forces['gravity'] = V3(0,0,0);
      dc.velocity.y = 0;
      if (mc && mc.jumping) mc.jumping = 0;
    } else {
      dc.forces['gravity'] = V3(0,-9.8,0);
    }

    e.translateX(dp.x);
    e.translateY(dp.y);
    e.translateZ(dp.z);

    if (mc) {
      if (e.position.y < -10) {
        e.respawn();
      }
    }

  });

};

Physics.findCollisions = function(dbb){
  return Component.getEntities("static").filter(function(e){
    return e.getBoundingBox().isIntersectionBox(dbb);
  });
};

}();
