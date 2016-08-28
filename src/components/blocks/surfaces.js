var THREE = require('three');

var surfaces = [null, {
  name: 'square',
  obstructs: true,
  hideWhenObstructed: true,
  add: function(i, j, k, f, d, u, v, geometry) {
    var coord = [];
    coord[d] = i;
    coord[u] = j;
    coord[v] = k;

    dis = [];
    dis[d] = 0;
    dis[u] = dis[v] = 0;
    var a = new THREE.Vector3().fromArray(
      [coord[0] + dis[0], coord[1] + dis[1], coord[2] + dis[2]]);
    dis[u] = 1;
    var b = new THREE.Vector3().fromArray(
      [coord[0] + dis[0], coord[1] + dis[1], coord[2] + dis[2]]);
    dis[v] = 1;
    var c = new THREE.Vector3().fromArray(
      [coord[0] + dis[0], coord[1] + dis[1], coord[2] + dis[2]]);
    dis[u] = 0;
    var d = new THREE.Vector3().fromArray(
      [coord[0] + dis[0], coord[1] + dis[1], coord[2] + dis[2]]);

    var index = geometry.vertices.length;
    geometry.vertices.push(a, b, c, d);

    geometry.faces.push(new THREE.Face3(index, index + 1, index + 2));
    geometry.faces.push(new THREE.Face3(index + 2, index + 3, index));
  }
}];

module.exports = surfaces;