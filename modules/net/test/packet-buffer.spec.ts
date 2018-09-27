import { expect } from 'chai';
import 'mocha';

import { PacketBuffer } from '../src';

describe('PacketBuffer', () => {
  describe('#length', () => {
    const newBuffer = new PacketBuffer(10);
    it('should return the length of the packet buffer.', () => {
      expect(newBuffer.length).to.equal(10, 'Initial length incorrect.');
    });
    it('should remain correct after the buffer is resized.', () => {
      newBuffer.resizeBuffer(5);
      expect(newBuffer.length).to.equal(5, 'Downsize length incorrect.');
      newBuffer.resizeBuffer(15);
      expect(newBuffer.length).to.equal(15, 'Upsize length incorrect.');
    });
  });
  describe('#remaining', () => {
    const newBuffer = new PacketBuffer(20);
    it('should return the number of free bytes in the buffer.', () => {
      expect(newBuffer.remaining).to.equal(20);
    });
    it('should remain correct after the buffer is filled.', () => {
      newBuffer.writeInt32(10);
      expect(newBuffer.remaining).to.equal(16);
    });
  });
  describe('#writeInt32()', () => {
    const newBuffer = new PacketBuffer(4);
    it('should write a big-endian int32 to the buffer.', () => {
      newBuffer.writeInt32(52);
      expect(newBuffer.data.readInt32BE(0)).to.equal(52, 'Incorrectly wrote int32.');
    });
    it('should advance the buffer index by 4.', () => {
      expect(newBuffer.bufferIndex).to.equal(4);
    });
    it('should write a default value for invalid inputs.', () => {
      newBuffer.bufferIndex = 0;
      newBuffer.writeInt32(null);
      expect(newBuffer.data.readInt32BE(0)).to.equal(0, 'Null caused non-default value for int32.');
      newBuffer.bufferIndex = 0;
      newBuffer.writeInt32('hello' as any);
      expect(newBuffer.data.readInt32BE(0)).to.equal(0, 'String caused non-default value for int32.');
    });
  });
  describe('#readInt32()', () => {
    const newBuffer = new PacketBuffer(4);
    newBuffer.data.writeInt32BE(52, 0);
    it('should read a big-endian int32 from the buffer.', () => {
      expect(newBuffer.readInt32()).to.equal(52, 'Incorrectly read int32.');
    });
    it('should advance the buffer index by 4.', () => {
      expect(newBuffer.bufferIndex).to.equal(4);
    });
  });

  describe('#writeUInt32()', () => {
    const newBuffer = new PacketBuffer(4);
    it('should write a big-endian unsigned int32 to the buffer.', () => {
      newBuffer.writeUInt32(1432);
      expect(newBuffer.data.readInt32BE(0)).to.equal(1432, 'Incorrectly wrote unsigned int32.');
    });
    it('should advance the buffer index by 4.', () => {
      expect(newBuffer.bufferIndex).to.equal(4);
    });
    it('should write a default value for invalid inputs.', () => {
      newBuffer.bufferIndex = 0;
      newBuffer.writeUInt32(null);
      expect(newBuffer.data.readUInt32BE(0)).to.equal(0, 'Null caused non-default value for unsigned int32.');
      newBuffer.bufferIndex = 0;
      newBuffer.writeUInt32('hello' as any);
      expect(newBuffer.data.readUInt32BE(0)).to.equal(0, 'String caused non-default value for unsigned int32.');
    });
  });
  describe('#readUInt32()', () => {
    const newBuffer = new PacketBuffer(4);
    newBuffer.data.writeUInt32BE(8072, 0);
    it('should read a big-endian unsigned int32 from the buffer.', () => {
      expect(newBuffer.readUInt32()).to.equal(8072, 'Incorrectly read unsigned int32.');
    });
    it('should advance the buffer index by 4.', () => {
      expect(newBuffer.bufferIndex).to.equal(4);
    });
  });

  describe('#writeShort()', () => {
    const newBuffer = new PacketBuffer(2);
    it('should write a big-endian int16 to the buffer.', () => {
      newBuffer.writeShort(352);
      expect(newBuffer.data.readInt16BE(0)).to.equal(352, 'Incorrectly wrote int16.');
    });
    it('should advance the buffer index by 2.', () => {
      expect(newBuffer.bufferIndex).to.equal(2);
    });
    it('should write a default value for invalid inputs.', () => {
      newBuffer.bufferIndex = 0;
      newBuffer.writeShort(null);
      expect(newBuffer.data.readInt16BE(0)).to.equal(0, 'Null caused non-default value for int16.');
      newBuffer.bufferIndex = 0;
      newBuffer.writeShort('hello' as any);
      expect(newBuffer.data.readInt16BE(0)).to.equal(0, 'String caused non-default value for int16.');
    });
  });
  describe('#readShort()', () => {
    const newBuffer = new PacketBuffer(2);
    newBuffer.data.writeInt16BE(762, 0);
    it('should read a big-endian unsigned int32 from the buffer.', () => {
      expect(newBuffer.readShort()).to.equal(762, 'Incorrectly read int16.');
    });
    it('should advance the buffer index by 2.', () => {
      expect(newBuffer.bufferIndex).to.equal(2);
    });
  });

  describe('#writeUnsignedShort()', () => {
    const newBuffer = new PacketBuffer(2);
    it('should write a big-endian int16 to the buffer.', () => {
      newBuffer.writeUnsignedShort(24);
      expect(newBuffer.data.readUInt16BE(0)).to.equal(24, 'Incorrectly wrote unsigned int16.');
    });
    it('should advance the buffer index by 2.', () => {
      expect(newBuffer.bufferIndex).to.equal(2);
    });
    it('should write a default value for invalid inputs.', () => {
      newBuffer.bufferIndex = 0;
      newBuffer.writeUnsignedShort(null);
      expect(newBuffer.data.readUInt16BE(0)).to.equal(0, 'Null caused non-default value for unsigned int16.');
      newBuffer.bufferIndex = 0;
      newBuffer.writeUnsignedShort('hello' as any);
      expect(newBuffer.data.readUInt16BE(0)).to.equal(0, 'String caused non-default unsigned value for int16.');
    });
  });
  describe('#readUnsignedShort()', () => {
    const newBuffer = new PacketBuffer(2);
    newBuffer.data.writeUInt16BE(1, 0);
    it('should read a big-endian unsigned int32 from the buffer.', () => {
      expect(newBuffer.readUnsignedShort()).to.equal(1, 'Incorrectly read unsigned int16.');
    });
    it('should advance the buffer index by 2.', () => {
      expect(newBuffer.bufferIndex).to.equal(2);
    });
  });

  describe('#writeByte()', () => {
    const newBuffer = new PacketBuffer(1);
    it('should write an int8 to the buffer.', () => {
      newBuffer.writeByte(14);
      expect(newBuffer.data.readInt8(0)).to.equal(14, 'Incorrectly wrote int8.');
    });
    it('should advance the buffer index by 1.', () => {
      expect(newBuffer.bufferIndex).to.equal(1);
    });
    it('should write a default value for invalid inputs.', () => {
      newBuffer.bufferIndex = 0;
      newBuffer.writeByte(null);
      expect(newBuffer.data.readInt8(0)).to.equal(0, 'Null caused non-default value for int8.');
      newBuffer.bufferIndex = 0;
      newBuffer.writeByte('hello' as any);
      expect(newBuffer.data.readInt8(0)).to.equal(0, 'String caused non-default value for int8.');
    });
  });
  describe('#readByte()', () => {
    const newBuffer = new PacketBuffer(1);
    newBuffer.data.writeInt8(3, 0);
    it('should read an int8 from the buffer.', () => {
      expect(newBuffer.readByte()).to.equal(3, 'Incorrectly read int8.');
    });
    it('should advance the buffer index by 1.', () => {
      expect(newBuffer.bufferIndex).to.equal(1);
    });
  });

  describe('#writeUnsignedByte()', () => {
    const newBuffer = new PacketBuffer(1);
    it('should write an unsigned int8 to the buffer.', () => {
      newBuffer.writeUnsignedByte(14);
      expect(newBuffer.data.readUInt8(0)).to.equal(14, 'Incorrectly wrote unsigned int8.');
    });
    it('should advance the buffer index by 1.', () => {
      expect(newBuffer.bufferIndex).to.equal(1);
    });
    it('should write a default value for invalid inputs.', () => {
      newBuffer.bufferIndex = 0;
      newBuffer.writeUnsignedByte(null);
      expect(newBuffer.data.readUInt8(0)).to.equal(0, 'Null caused non-default value for unsigned int8.');
      newBuffer.bufferIndex = 0;
      newBuffer.writeUnsignedByte('hello' as any);
      expect(newBuffer.data.readUInt8(0)).to.equal(0, 'String caused non-default value for unsigned int8.');
    });
  });
  describe('#readUnsignedByte()', () => {
    const newBuffer = new PacketBuffer(1);
    newBuffer.data.writeUInt8(245, 0);
    it('should read an unsigned int8 from the buffer.', () => {
      expect(newBuffer.readUnsignedByte()).to.equal(245, 'Incorrectly read unsigned int8.');
    });
    it('should advance the buffer index by 1.', () => {
      expect(newBuffer.bufferIndex).to.equal(1);
    });
  });

  describe('#writeBoolean()', () => {
    const newBuffer = new PacketBuffer(1);
    it('should write a boolean to the buffer.', () => {
      newBuffer.writeBoolean(true);
      expect(newBuffer.data.readInt8(0)).to.equal(1, 'Incorrectly wrote boolean.');
    });
    it('should advance the buffer index by 1.', () => {
      expect(newBuffer.bufferIndex).to.equal(1);
    });
    it('should write a default value for invalid inputs.', () => {
      newBuffer.bufferIndex = 0;
      newBuffer.writeBoolean(null);
      expect(newBuffer.data.readInt8(0)).to.equal(0, 'Null caused non-default value for boolean.');
      newBuffer.bufferIndex = 0;
      newBuffer.writeBoolean('hello' as any);
      expect(newBuffer.data.readInt8(0)).to.equal(0, 'String caused non-default value for boolean.');
    });
  });
  describe('#readBoolean()', () => {
    const newBuffer = new PacketBuffer(1);
    newBuffer.data.writeInt8(0, 0);
    it('should read a boolean from the buffer.', () => {
      expect(newBuffer.readBoolean()).to.equal(false, 'Incorrectly read boolean.');
    });
    it('should advance the buffer index by 1.', () => {
      expect(newBuffer.bufferIndex).to.equal(1);
    });
  });

  describe('#writeFloat()', () => {
    const newBuffer = new PacketBuffer(4);
    it('should write a float32 to the buffer.', () => {
      newBuffer.writeFloat(3.14159);
      expect(newBuffer.data.readFloatBE(0)).to.be.closeTo(3.14159, 0.000001, 'Incorrectly wrote float32.');
    });
    it('should advance the buffer index by 4.', () => {
      expect(newBuffer.bufferIndex).to.equal(4);
    });
    it('should write a default value for invalid inputs.', () => {
      newBuffer.bufferIndex = 0;
      newBuffer.writeFloat(null);
      expect(newBuffer.data.readFloatBE(0)).to.equal(0, 'Null caused non-default value for float32.');
      newBuffer.bufferIndex = 0;
      newBuffer.writeFloat('hello' as any);
      expect(newBuffer.data.readFloatBE(0)).to.equal(0, 'String caused non-default value for float32.');
    });
  });
  describe('#readFloat()', () => {
    const newBuffer = new PacketBuffer(4);
    newBuffer.data.writeFloatBE(6.23214, 0);
    it('should read a float32 from the buffer.', () => {
      expect(newBuffer.readFloat()).to.be.closeTo(6.23214, 0.000001, 'Incorrectly read float32.');
    });
    it('should advance the buffer index by 4.', () => {
      expect(newBuffer.bufferIndex).to.equal(4);
    });
  });

  describe('#writeByteArray()', () => {
    const newBuffer = new PacketBuffer(6);
    it('should write the length header to the buffer.', () => {
      newBuffer.writeByteArray([1, 3, 5, 7]);
      expect(newBuffer.data.readInt16BE(0)).to.equal(4, 'Incorrectly wrote length header.');
    });
    it('should write the correct elements', () => {
      expect(newBuffer.data.readInt8(2)).to.equal(1, 'Incorrect 1st element.');
      expect(newBuffer.data.readInt8(3)).to.equal(3, 'Incorrect 2nd element.');
      expect(newBuffer.data.readInt8(4)).to.equal(5, 'Incorrect 3rd element.');
      expect(newBuffer.data.readInt8(5)).to.equal(7, 'Incorrect 4th element.');
    });
    it('should advance the buffer index by 2 + the number of elements.', () => {
      expect(newBuffer.bufferIndex).to.equal(6);
    });
    it('should write a default value for invalid inputs.', () => {
      newBuffer.bufferIndex = 0;
      newBuffer.writeByteArray(null);
      expect(newBuffer.data.readInt16BE(0)).to.equal(0, 'Null caused non-default value for byte array length header.');
      newBuffer.bufferIndex = 0;
      newBuffer.writeByteArray('hello' as any);
      expect(newBuffer.data.readInt16BE(0)).to.equal(0, 'String caused non-default value for byte array length header.');
    });
  });
  describe('#readByteArray()', () => {
    const newBuffer = new PacketBuffer(6);
    newBuffer.data.writeInt16BE(4, 0);
    newBuffer.data.writeInt8(4, 2);
    newBuffer.data.writeInt8(1, 3);
    newBuffer.data.writeInt8(29, 4);
    newBuffer.data.writeInt8(123, 5);
    const byteArray = newBuffer.readByteArray();
    it('should read the length header correctly.', () => {
      expect(byteArray.length).to.equal(4, 'Incorrect length header read.');
    });
    it('should read the correct bytes from the buffer.', () => {
      expect(byteArray[0]).to.equal(4, 'Incorrect 1st element.');
      expect(byteArray[1]).to.equal(1, 'Incorrect 2nd element.');
      expect(byteArray[2]).to.equal(29, 'Incorrect 3rd element.');
      expect(byteArray[3]).to.equal(123, 'Incorrect 4th element.');
    });
    it('should advance the buffer index by 2 + the number of elements.', () => {
      expect(newBuffer.bufferIndex).to.equal(6);
    });
  });

  describe('#writeString()', () => {
    const newBuffer = new PacketBuffer(8);
    it('should write the length header to the buffer.', () => {
      newBuffer.writeString('Hello,');
      expect(newBuffer.data.readInt16BE(0)).to.equal(6, 'Incorrectly wrote length header.');
    });
    it('should write a string to the buffer.', () => {
      expect(newBuffer.data.slice(2).toString('utf8')).to.equal('Hello,', 'Incorrectly wrote string.');
    });
    it('should advance the buffer index by 2 + the length of the string.', () => {
      expect(newBuffer.bufferIndex).to.equal(8);
    });
    it('should write a default value for invalid inputs.', () => {
      newBuffer.bufferIndex = 0;
      newBuffer.writeString(null);
      expect(newBuffer.data.readInt16BE(0)).to.equal(0, 'Null caused non-default value for string length header.');
      newBuffer.bufferIndex = 0;
      newBuffer.writeString(4237 as any);
      expect(newBuffer.data.readInt16BE(0)).to.equal(0, 'Number caused non-default value for string length header.');
    });
  });
  describe('#readString()', () => {
    const newBuffer = new PacketBuffer(8);
    newBuffer.data.writeInt16BE(6, 0);
    Buffer.from('World!').copy(newBuffer.data, 2);
    const str = newBuffer.readString();
    it('should read the length header correctly.', () => {
      expect(str.length).to.equal(6, 'Incorrect length header read.');
    });
    it('should read a string from the buffer.', () => {
      expect(str).to.equal('World!', 'Incorrectly read string.');
    });
    it('should advance the buffer index by 2 + the length of the string.', () => {
      expect(newBuffer.bufferIndex).to.equal(8);
    });
  });

  describe('#writeStringUTF32()', () => {
    const newBuffer = new PacketBuffer(8);
    it('should write the length header to the buffer.', () => {
      newBuffer.writeStringUTF32('Test');
      expect(newBuffer.data.readInt32BE(0)).to.equal(4, 'Incorrectly wrote length header.');
    });
    it('should write a string to the buffer.', () => {
      expect(newBuffer.data.slice(4).toString('utf8')).to.equal('Test', 'Incorrectly wrote utf32 string.');
    });
    it('should advance the buffer index by 4 + the length of the string.', () => {
      expect(newBuffer.bufferIndex).to.equal(8);
    });
    it('should write a default value for invalid inputs.', () => {
      newBuffer.bufferIndex = 0;
      newBuffer.writeStringUTF32(null);
      expect(newBuffer.data.readInt32BE(0)).to.equal(0, 'Null caused non-default value for utf32 string length header.');
      newBuffer.bufferIndex = 0;
      newBuffer.writeStringUTF32(4237 as any);
      expect(newBuffer.data.readInt32BE(0)).to.equal(0, 'Number caused non-default value for utf32 string length header.');
    });
  });
  describe('#readStringUTF32()', () => {
    const newBuffer = new PacketBuffer(8);
    newBuffer.data.writeInt32BE(4, 0);
    Buffer.from('1234').copy(newBuffer.data, 4);
    const str = newBuffer.readStringUTF32();
    it('should read the length header correctly.', () => {
      expect(str.length).to.equal(4, 'Incorrect length header read.');
    });
    it('should read a string from the buffer.', () => {
      expect(str).to.equal('1234', 'Incorrectly read string.');
    });
    it('should advance the buffer index by 4 + the length of the string.', () => {
      expect(newBuffer.bufferIndex).to.equal(8);
    });
  });

  describe('#resize()', () => {
    const newBuffer = new PacketBuffer(10);
    Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).copy(newBuffer.data);
    it('should change the length of the buffer.', () => {
      newBuffer.resizeBuffer(5);
      expect(newBuffer.length).to.equal(5, 'New length incorrect.');
    });
    it('should not change the actual buffer length if the new length is smaller.', () => {
      expect(newBuffer.data.length).to.equal(10, 'New buffer length incorrect.');
    });
    it('should not affect the buffer contents.', () => {
      expect([...newBuffer.data]).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'New contents incorrect.');
    });
    it('should increase the actual buffer when required.', () => {
      newBuffer.resizeBuffer(15);
      expect(newBuffer.data.length).to.equal(15, 'New buffer length incorrect.');
    });
  });
  describe('#reset()', () => {
    const newBuffer = new PacketBuffer(100);
    newBuffer.writeString('Example data');
    newBuffer.reset();
    it('should reset the buffer index.', () => {
      expect(newBuffer.bufferIndex).to.equal(0, 'Buffer index not reset.');
    });
    it('should reset the data buffer', () => {
      expect(newBuffer.data.length).to.equal(1024, 'Data buffer not reset.');
    });
    it('should ensure the length stays correct.', () => {
      expect(newBuffer.length).to.equal(newBuffer.data.length, 'New length incorrect.');
    });
  });
});
