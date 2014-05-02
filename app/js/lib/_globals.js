window.PI = Math.PI;
window.HALF_PI = PI / 2;

window.V2 = function(x,y){return new THREE.Vector2(x,y)};
window.V3 = function(x,y,z){return new THREE.Vector3(x,y,z)};
window.V4 = function(x,y,z,w){return new THREE.Vector4(x,y,z,w)};
window.Eu = function(x,y,z){return new THREE.Euler(x,y,z)};
window.Qu = function(x,y,z,w){return new THREE.Quaternion(x,y,z,w)};

V2.fromArray = function(a){return V2(a[0],a[1]);};
V3.fromArray = function(a){return V3(a[0],a[1],a[2]);};
V4.fromArray = function(a){return V4(a[0],a[1],a[2],a[3]);};
Eu.fromArray = function(a){return Eu(a[0],a[1],a[2]);};
