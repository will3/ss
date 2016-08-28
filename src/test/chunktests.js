var Chunks = require('../components/blocks/chunk').Chunks;
var expect = require('chai').expect;

describe('Chunks', function() {
  it('should set value', function() {
    var chunks = new Chunks();
    chunks.set(0, 0, 0, 1);
    expect(chunks.get(0, 0, 0)).to.equal(1);
    expect(chunks.get(0, 0, 1)).to.be.empty;
  });

  it('should be resizable', function() {
    var chunks = new Chunks();
    chunks.set(999, 999, 999, 1);
    expect(chunks.get(999, 999, 999)).to.equal(1);
    expect(chunks.get(999, 999, 998)).to.be.empty;
  });

  it('should set dirty', function() {
    var chunks = new Chunks();
    chunks.set(0, 0, 0, 1);
    expect(chunks.map['0|0|0'].dirty).to.be.true;
  });
});
