var _ = require('lodash');
var jsondiffpatch = require('jsondiffpatch');

module.exports = function(http) {
  var io = require('socket.io')(http);

  var entities = {};

  var clients = {};

  var ack = 0;
  var packetBufferLength = 100;

  io.on('connection', function(socket) {
    console.log('a user connected');
    var client = {
      socket: socket,
      lastAckState: {},
      packets: [],
      entities: {}
    };
    clients[socket.id] = client;

    if (self.onClient != null) {
      self.onClient(client);
    }

    socket.on('ack', function(ack) {
      client.ack = ack;
      var packet = _.find(client.packets, function(packet) {
        return packet.ack == ack;
      });
      client.lastAckState = packet == null ? {} : packet.state;
    });

    socket.on('rpc', function(rpcs) {
      for (var i = 0; i < rpcs.length; i++) {
        var rpc = rpcs[i];
        var id = rpc[0];
        var entity = client.entities[id];

        if (entity == null) {
          continue;
        }

        var func = rpc[1];
        if (entity[func] == null) {
          continue;
        }

        entity[func].apply(null, rpc.slice(2));
      }
    });

    socket.on('disconnect', function() {
      console.log('a user disconnected');
      for (var id in client.entities) {
        if (self.onRemove) {
          self.onRemove(client.entities[id]);
        }
      }

      delete entities[id];
      delete clients[socket.id];
    });
  });

  function tick() {
    var state = getGameState();
    for (var id in clients) {
      var client = clients[id];

      var packet = {
        state: state,
        ack: ack
      };

      client.packets.push(packet);
      if (client.packets.length > packetBufferLength) {
        client.packets.shift();
      }

      var delta = getDelta(client.lastAckState, state);

      client.socket.emit('state', {
        delta: delta,
        ack: ack
      });
    }
    ack++;
  };

  function getDelta(from, to) {
    var add = {};
    var remove = [];
    var update = {};

    var delta = {};

    for (var id in to) {
      var prev = from[id];
      if (prev == null) {
        // prev doesn't exist, add
        add[id] = to[id];
      } else {
        // prev exists, patch entity
        var patch = jsondiffpatch.diff(prev, to[id]);
        if (patch != null) {
          update[id] = patch;
        }
      }
    }

    for (var id in from) {
      // no long exists, remove
      if (to[id] == null) {
        remove.push(id);
      }
    }

    return {
      add: add,
      remove: remove,
      update: update
    }
  };

  function getGameState() {
    var state = {};
    for (var id in entities) {
      var entity = entities[id];
      state[id] = entity.serialize();
      state[id].__type = entity.type;
      state[id].__id = id;
    }
    return state;
  };

  function add(object, client) {
    if (object._id == null) {
      throw new Error('must add game object');
    }
    if (object.serialize == null || object.deserialize == null) {
      throw new Error('object must implement serialize and deserialize');
    }
    if (object.type == null) {
      throw new Error('object must have type');
    }

    entities[object._id] = object;
    client.entities[object._id] = object;
  };

  var self = {
    tick: tick,
    add: add,
    onClient: null,
    onRemove: null
  };

  return self;
};
