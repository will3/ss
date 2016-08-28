var Chunks = require('./chunk').Chunks;
var THREE = require('three');
var surfaces = require('./surfaces');

var Blocks = function() {
  var chunks = new Chunks();

  var object = new THREE.Object3D();
  var material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  });

  function tick() {

  };

  function updateMesh() {
    for (var id in chunks.map) {
      var chunk = chunks.map[id];
      if (chunk.dirty) {

        if (chunk.object != null) {
          chunk.object.geometry.dispose();
        }

        var geometry = updateChunk(chunk.data);

        var obj = new THREE.Mesh(geometry, material);
        obj.position.fromArray(chunk.offset);
        object.add(obj);

        console.log(geometry.vertices.length);

        chunk.dirty = false;
      }
    }
  };

  function updateChunk(chunk) {
    var geometry = new THREE.Geometry();

    var size = chunk.size;

    for (var d = 0; d < 3; d++) {
      var u = (d + 1) % 3;
      var v = (d + 2) % 3;

      function add(a, b, i, j, k, f) {
        if (a && (!a.hideWhenObstructed || !b || !b.obstructs)) {
          a.add(i, j, k, f, d, u, v, geometry);
        }
      }

      for (i = -1; i < size[d]; i++) {
        var i2 = i + 1;
        for (j = 0; j < size[u]; j++) {
          for (k = 0; k < size[v]; k++) {
            var coord = [];
            coord[d] = i;
            coord[u] = j;
            coord[v] = k;
            var sa = i == -1 ? 0 : chunk.get(coord[0], coord[1], coord[2]);
            coord[d] = i2;
            var sb = i2 == size[d] ? 0 : chunk.get(coord[0], coord[1], coord[2]);

            var a = surfaces[sa];
            var b = surfaces[sb];

            if (!a && !b) {
              continue;
            }

            add(a, b, i2, j, k, false);
            add(b, a, i2, j, k, true);
          }
        }
      }
    }

    geometry.mergeVertices();

    return geometry;
  };

  return {
    object: object,
    chunks: chunks,
    updateMesh: updateMesh,
    updateChunk: updateChunk,
    tick: tick
  };
};

module.exports = Blocks;
