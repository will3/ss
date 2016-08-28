var jsondiffpatch = require('jsondiffpatch');

module.exports = function(opts) {
  opts = opts || {};
  var addEntity = opts.addEntity;
  var hasEntity = opts.hasEntity;
  var removeEntity = opts.removeEntity;
  var getEntity = opts.getEntity;

  var io = require('socket.io-client');
  var socket = io();

  var bindings = {};
  var states = {};
  var pending = {
    rpcs: []
  };

  function bind(type, constructor) {
    bindings[type] = constructor;
  };

  socket.on('state', function(packet) {
    processDelta(packet.delta);
    socket.emit('ack', packet.ack);
  });

  function processDelta(delta) {
    for (var id in delta.add) {
      create(delta.add[id]);
      states[id] = delta.add[id];
    }

    for (var id in delta.update) {
      var entity = getEntity(id);
      if (entity == null) {
        // Shouldn't happen
        continue;
      }

      var newState = jsondiffpatch.patch(states[id], delta.update[id]);
      entity.deserialize(newState);
    }

    for (var i = 0; i < delta.remove.length; i++) {
      var id = delta.remove[i];
      removeEntity(id);
      delete states[id];
    }
  };

  function create(state) {
    var id = state.__id;
    if (hasEntity(id)) {
      return;
    }

    var type = state.__type;
    var binding = bindings[type];
    if (binding == null) {
      throw new Error('binding not found for ' + type);
    }
    var entity = new binding();
    entity._id = id;
    entity.deserialize(state);
    addEntity(entity);
  };

  function rpc(object, func) {
    var args = Array.prototype.slice.call(arguments);
    args[0] = object._id;
    pending.rpcs.push(args);
  };

  function tick() {
    if (pending.rpcs.length > 0) {
      socket.emit('rpc', pending.rpcs);
    }
    pending.rpcs = [];
  };

  return {
    bind: bind,
    rpc: rpc,
    tick: tick
  }
};
