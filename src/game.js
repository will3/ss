module.exports = function() {
  var map = {};
  var startPool = {};
  var destroyPool = {};

  function add(object) {
    if (object._id == null) {
      object._id = guid();
    }
    map[object._id] = object;

    startPool[object._id] = object;
  };

  function has(id) {
    return map[id] != null;
  };

  function get(id) {
    return map[id];
  };

  function remove(object) {
    var id = typeof object === 'string' ? object : object._id;
    if(map[id] == null) {
      return;
    }
    destroyPool[id] = map[id];
    delete map[id];
  };

  function tick(dt) {
    for (var id in startPool) {
      if (startPool[id].start != null) {
        startPool[id].start();
      }
    }
    startPool = {};

    for (var id in map) {
      if (map[id].tick != null) {
        map[id].tick(dt);
      }
    }

    for (var id in destroyPool) {
      if (destroyPool[id].destroy != null) {
        destroyPool[id].destroy();
      }
    }
    destroyPool = {};
  };

  var self = {
    add: add,
    has: has,
    get: get,
    remove: remove,
    tick: tick
  };

  return self;
};

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};
