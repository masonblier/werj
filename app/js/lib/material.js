+function(){

var Material = window.Material = {};

Material.anisotropy = 1;

Material.load = function(mat, cb){
  var tmat = null;

  if (mat.url) {
    mat.map = Material.loadTexture(mat.url, undefined, cb);
  }
  switch (mat.type) {
    case 'lambert':
      tmat = new THREE.MeshLambertMaterial(mat);
    case 'phong':
      tmat = new THREE.MeshPhongMaterial(mat);
  }

  return Physijs.createMaterial(tmat, mat.friction||0, mat.restition||0);
};

Material.loadTexture = function ( url, mapping, onLoad, onError ) {
  var loader = new THREE.ImageLoader();
  loader.crossOrigin = THREE.ImageUtils.crossOrigin;

  var texture = new THREE.Texture( undefined, mapping );
  texture.anisotropy = Material.anisotropy;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  var image = loader.load( url, function () {

    texture.needsUpdate = true;

    if ( onLoad ) onLoad( texture );
  } );

  texture.image = image;
  texture.sourceFile = url;

  return texture;

};

Material.loadCubeMaterial = function(mat, geo, cb) {
  var tx = Material.load(mat, cb);
  var ty = Material.load(mat);
  var tz = Material.load(mat);

  tx.map.repeat.set(geo.depth, geo.height);
  ty.map.repeat.set(geo.width, geo.depth);
  tz.map.repeat.set(geo.width, geo.height);

  var tmat = new THREE.MeshFaceMaterial([
    tx, tx, ty, ty, tz, tz
  ]);

  return Physijs.createMaterial(tmat, mat.friction||0, mat.restition||0);
};

}();
