module.exports = function(http) {
  var server = require('./systems/server')(http);
  var game = require('./game')();

  function tick() {
    server.tick();
    setTimeout(tick, 1000 / 24);
  };

  server.onClient = function(client) {
    var Ship = require('./components/ship');
    var ship = new Ship();

    game.add(ship);
    server.add(ship, client);
  };

  server.onRemove = function(entity) {
    game.remove(entity);
  };

  tick();
};
