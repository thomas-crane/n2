const { Writable } = require('stream');
exports.MockStream = class MockStream extends Writable {
  constructor(options) {
    super(options);
    this.data = Buffer.alloc(0);
  }
  write(chunk) {
    this.data = Buffer.concat([this.data, chunk], this.data.length + chunk.length);
  }
  end(chunk, callback) {
    if (chunk) {
      this.data = Buffer.concat([this.data, chunk], this.data.length + chunk.length);
    }
    if (callback) {
      callback();
    } else {
      this.emit('close');
    }
  }
}
