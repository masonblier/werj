+function(){

function StaticPrism(opts){
  this.level = opts.level;

  var go = opts.geometry;
  var geo = new THREE.CylinderGeometry(
    go.radiusTop||go.radius,
    go.radiusBottom||go.radius,
    go.length, 3, 1
  );
  var mat = this.level.loadMaterial(opts.material);//, geo);
  Physijs.ConvexMesh.call(this, geo, mat, 0);

  // console.log(this.rotation)
  this.rotation = (opts.rotation ? Eu.fromArray(opts.rotation) : Eu(0,0,0));
  this.rotation.setFromQuaternion(
    Qu().setFromEuler(Eu(-HALF_PI,0,0)).multiply(this.rotation._quaternion)
  );
  this.position = V3.fromArray(opts.position);
}
window.StaticPrism = StaticPrism;
util.extends(StaticPrism, Physijs.ConvexMesh);

StaticPrism.prototype.getBoundingBox = function(){
  return this.bb;
};

}();
