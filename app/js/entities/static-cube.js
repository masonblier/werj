+function(){

function StaticCube(opts){
  this.level = opts.level;

  var geo = new THREE.CubeGeometry(
    opts.geometry.width,
    opts.geometry.height,
    opts.geometry.depth
  );
  var mat = this.level.loadMaterial(opts.material, geo);
  Physijs.BoxMesh.call(this, geo, mat, 0);

  this.position = V3.fromArray(opts.position);
}
window.StaticCube = StaticCube;
util.extends(StaticCube, Physijs.BoxMesh);

StaticCube.prototype.getBoundingBox = function(){
  return this.bb;
};

}();
