+function(){

function Level(scene){
  this.scene = scene;
}
window.Level = Level;

Level.prototype.load = function(jso){
  this.name = jso.name;
  this.spawn = V3.fromArray(jso.spawn);

  this.materials = {};
  for (var mname in jso.materials) {
    this.materials[mname] = jso.materials[mname];
  }

  var ei = jso.entities.length;
  while (ei--) {
    this.scene.add(this.loadEntity(jso.entities[ei]));
  }
};

Level.prototype.loadMaterial = function(mat, geo){
  if ('string'===typeof mat) {
    if (!this.materials[mat])
      throw new Error("material '"+mat+"' does not exist");
    mat = this.materials[mat];
  }
  if (geo && mat.url){
    return Material.loadCubeMaterial(mat, geo);
  } else {
    return Material.load(mat);
  }
};

Level.prototype.loadEntity = function(en){
  en.level = this;

  switch (en.type) {
  case 'box':
    return new StaticCube(en)
  case 'prism':
    return new StaticPrism(en)
  case 'trigger':
    return new Trigger(en)
  case 'light':
    var light = new THREE.PointLight(en.color, en.intensity, en.distance);
    light.position = V3.fromArray(en.position);
    return light
  }
};

}();
