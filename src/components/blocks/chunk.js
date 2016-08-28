var Chunk = function(size) {
  this.size = size || [16, 16, 16];
  this.YZ = this.size[1] * this.size[2];
  this.data = [];
};

Chunk.prototype.get = function(i, j, k) {
  return this.data[i * this.YZ + j * this.size[2] + k];
};

Chunk.prototype.set = function(i, j, k, v) {
  this.data[i * this.YZ + j * this.size[2] + k] = v;
};

var Chunks = function() {
  this.chunkSize = 16;
  this.map = {};
};

Chunks.prototype.get = function(i, j, k) {
  var origin = this._getOrigin(i, j, k);
  var id = origin.join('|');

  if (this.map[id] == null) {
    return null;
  }

  var chunk = this.map[id];
  var offset = chunk.offset;

  return chunk.data.get(i - offset[0], j - offset[1], k - offset[2]);
};

Chunks.prototype.set = function(i, j, k, v) {
  var origin = this._getOrigin(i, j, k);
  var id = origin.join('|');

  if (this.map[id] == null) {
    this.map[id] = {
      origin: origin,
      offset: [origin[0] * this.chunkSize, origin[1] * this.chunkSize, origin[2] * this.chunkSize],
      data: new Chunk(),
      dirty: false
    };
  }

  var chunk = this.map[id];
  var offset = chunk.offset;

  chunk.data.set(i - offset[0], j - offset[1], k - offset[2], v);
  chunk.dirty = true;
};

Chunks.prototype._getOrigin = function(i, j, k) {
  var origin = [
    Math.floor(i / this.chunkSize),
    Math.floor(j / this.chunkSize),
    Math.floor(k / this.chunkSize)
  ];

  return origin;
};

Chunk.Chunks = Chunks;
module.exports = Chunk;
