var THREE = require('three');
var bottle = require('./bottle');

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', onWindowResize)

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

camera.position.set(10, 10, 10);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var game = require('./game')();

var client = require('./systems/client')({
  addEntity: game.add,
  hasEntity: game.has,
  removeEntity: game.remove,
  getEntity: game.get
});

client.bind('ship', require('./components/ship'));

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
  game.tick();
  client.tick();
};

bottle.value('scene', scene);
bottle.value('client', client);

render();
