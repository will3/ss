var Blocks = require('./blocks');
var THREE = require('three');
var container = require('../container');

var Ship = function() {
  var blocks = new Blocks();

  function start() {
    blocks.chunks.set(0, 0, 0, 1);
    blocks.updateMesh();

    if (container.scene) {
      container.scene.add(blocks.object);
    }

    if (container.client) {
      window.addEventListener('mousedown', function() {
        container.client.rpc(self, 'serverMove', 0.1);
      });
    }
  };

  function serverMove(amount) {
    blocks.object.position.y += amount;
  };

  function tick(dt) {

  };

  function destroy() {
    if (container.scene) {
      container.scene.remove(blocks.object);
    }
  };

  function serialize() {
    return {
      position: blocks.object.position.toArray()
    };
  };

  function deserialize(json) {
    if (json.position != null) {
      blocks.object.position.fromArray(json.position);
    }
  };

  var self = {
    type: 'ship',
    start: start,
    tick: tick,
    destroy: destroy,
    serialize: serialize,
    deserialize: deserialize,
    serverMove: serverMove
  };

  return self;
};

module.exports = Ship;
