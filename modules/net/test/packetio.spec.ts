import { expect } from 'chai';
import 'mocha';

import { PacketIO, INCOMING_KEY, OUTGOING_KEY, PacketType, LoadPacket, Mapper } from '../src';
import { Socket } from 'net';

describe('PacketIO', () => {
  it('should use default values for the rc4Config.', () => {
    const packetIO = new PacketIO(new Socket());
    expect((packetIO as any).sendRC4.key.toString('hex')).to.equal(OUTGOING_KEY, 'Incorrect default outgoing key.');
    expect((packetIO as any).receiveRC4.key.toString('hex')).to.equal(INCOMING_KEY, 'Incorrect default outgoing key.');
  });
  it('should use provided values when an rc4Config is provided.', () => {
    const packetIO = new PacketIO(new Socket(), {
      incomingKey: 'a0b1c2',
      outgoingKey: 'd3e4f5'
    });
    expect((packetIO as any).sendRC4.key.toString('hex')).to.equal('d3e4f5', 'Incorrect default outgoing key.');
    expect((packetIO as any).receiveRC4.key.toString('hex')).to.equal('a0b1c2', 'Incorrect default outgoing key.');
  });
  describe('#attach()', () => {
    it('should throw a TypeError for invalid inputs.', () => {
      const packetIO = new PacketIO();
      expect(() => packetIO.attach(123 as any)).to.throw(TypeError);
      expect(() => packetIO.attach('Hello, World!' as any)).to.throw(TypeError);
      expect(() => packetIO.attach(null)).to.throw(TypeError);
    });

    it('should attach event listeners to the socket.', () => {
      const socket = new Socket();
      const packetIO = new PacketIO();
      packetIO.attach(socket);
      expect(socket.listenerCount('connect')).to.equal(1, 'Incorrect listener count for connect event.');
      expect(socket.listenerCount('data')).to.equal(1, 'Incorrect listener count for close event.');
    });
    it('#should detach first if there is a socket already attached.', () => {
      const socketA = new Socket();
      const socketB = new Socket();
      const packetIO = new PacketIO();
      packetIO.attach(socketA);
      packetIO.attach(socketB);
      expect(socketA.listenerCount('connect')).to.equal(0, 'Incorrect listener count for connect event.');
      expect(socketA.listenerCount('data')).to.equal(0, 'Incorrect listener count for close event.');
    });
  });
  describe('#detach()', () => {
    it('should remove the event listeners from the socket.', () => {
      const socket = new Socket();
      const packetIO = new PacketIO(socket);
      socket.on('data', () => null);
      socket.on('close', () => null);
      packetIO.detach();
      expect(socket.listenerCount('data')).to.equal(1, 'Incorrect listener count for data event.');
      expect(socket.listenerCount('close')).to.equal(1, 'Incorrect listener count for close event.');
    });
    it('should not remove any packet event listeners.', () => {
      const packetIO = new PacketIO(new Socket());
      packetIO.on(PacketType.LOAD, () => null);
      packetIO.on(PacketType.IMMINENT_ARENA_WAVE, () => null);
      packetIO.detach();
      expect(packetIO.listenerCount(PacketType.LOAD)).to.equal(1, 'Packet listener not removed.');
      expect(packetIO.listenerCount(PacketType.IMMINENT_ARENA_WAVE)).to.equal(1, 'Packet listener not removed.');
    });
  });
  describe('#send()', () => {
    it('should emit an error if the mapper is missing the id for the packet type being sent.', () => {
      const packetIO = new PacketIO(new Socket());
      expect(() => packetIO.send(new LoadPacket())).to.throw();
    });
    it('should send the packet.', (done) => {
      Mapper.reverseMap.set(PacketType.LOAD, 10);
      const socket = new Socket();
      const packetIO = new PacketIO(socket);
      (socket as any).write = (data: Buffer) => {
        expect(data.length).to.equal(10, 'Packet sent incorrectly');
        done();
      };
      packetIO.send(new LoadPacket());
    });
  });
  describe('#emitPacket()', () => {
    it('should emit the packet if the input is valid.', (done) => {
      const packetIO = new PacketIO(new Socket());
      packetIO.once(PacketType.LOAD, (packet: LoadPacket) => {
        expect(packet.charId).to.equal(431, 'Incorrect packet emitted.');
        done();
      });
      const load = new LoadPacket();
      load.charId = 431;
      packetIO.emitPacket(load as any);
    });
    it('should throw a TypeError if the input is invalid.', () => {
      const packetIO = new PacketIO(new Socket());
      expect(() => packetIO.emitPacket(null)).to.throw(TypeError);
      expect(() => packetIO.emitPacket(1243 as any)).to.throw(TypeError);
      expect(() => packetIO.emitPacket('Hello, World!' as any)).to.throw(TypeError);
    });
  });
  describe('#emitError()', () => {
    it('should emit the error as an event if there are listeners for it.', (done) => {
      const packetIO = new PacketIO(new Socket());
      packetIO.once('error', (error: Error) => {
        expect(error.message).to.equal('Test message', 'Incorrect error emitted.');
        done();
      });
      (packetIO as any).emitError(new Error('Test message'));
    });
    it('should throw the error if there are no listeners.', () => {
      const packetIO = new PacketIO(new Socket());
      expect(() => (packetIO as any).emitError(new Error('Test message'))).to.throw();
    });
  });
});
