var Blocks = require('../components/blocks');
var Chunk = require('../components/blocks/chunk');
var expect = require('chai').expect;

describe('Blocks', function() {
  it('should mesh a cube', function() {
    var blocks = new Blocks();
    var chunk = new Chunk();
    chunk.set(0, 0, 0, 1);
    var geometry = blocks.updateChunk(chunk);
    expect(geometry.vertices).to.have.length(8);
    expect(geometry.faces).to.have.length(12);
  });

  it('should mesh two neighbour cubes', function() {
    var blocks = new Blocks();
    var chunk = new Chunk();
    chunk.set(0, 0, 0, 1);
    chunk.set(1, 0, 0, 1);
    var geometry = blocks.updateChunk(chunk);
    expect(geometry.vertices).to.have.length(12);
    expect(geometry.faces).to.have.length(20);
  });
});
