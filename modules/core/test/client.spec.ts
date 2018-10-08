import { expect } from 'chai';
import 'mocha';

import { Client, Server } from '../src';
import * as net from 'net';
import { Mapper, PacketType } from '@n2/net';

const LOCALHOST: Server = {
  ip: '0.0.0.0',
  name: 'localhost',
  usage: 0,
  location: {
    lat: 0,
    long: 0
  }
};

describe('Client', () => {
  const mockAccountInfo = {
    guid: 'example@email.com',
    password: '12345',
    info: {} as any
  };
  it('should throw a TypeError for invalid constructor parameters.', () => {
    expect(() => new Client(432 as any)).to.throw(TypeError);
    expect(() => new Client(null)).to.throw(TypeError);
    expect(() => new Client('Hello world' as any)).to.throw(TypeError);
  });
  describe('#connected', () => {
    const server = net.createServer();
    beforeEach((done) => {
      server.listen(2050, '0.0.0.0', () => {
        done();
      });
    });
    afterEach((done) => {
      server.close(() => {
        done();
      });
    });
    it('should be true if the client is currently connected.', (done) => {
      const client = new Client(mockAccountInfo);
      client.attach(new net.Socket());
      client.io.socket.once('connect', () => {
        expect(client.connected).to.equal(true, 'Incorrect value for connected getter.');
        client.io.socket.destroy();
        done();
      });
      client.io.socket.connect(2050, '0.0.0.0');
    });
    it('should be false if the client is not connected.', (done) => {
      const client = new Client(mockAccountInfo);
      client.attach(new net.Socket());
      expect(client.connected).to.equal(false, 'Incorrect initial value for connected getter.');
      client.io.socket.once('close', () => {
        expect(client.connected).to.equal(false, 'Incorrect value for connected getter.');
        done();
      });
      client.io.socket.connect(2050, '0.0.0.0', () => {
        client.io.socket.destroy();
      });
    });
  });
  describe('#connect()', () => {
    const server = net.createServer();
    beforeEach((done) => {
      server.listen(2050, '0.0.0.0', () => {
        done();
      });
    });
    afterEach((done) => {
      server.close(() => {
        done();
      });
    });
    it('should throw a TypeError for invalid inputs.', () => {
      const client = new Client(mockAccountInfo);
      client.attach(new net.Socket());
      expect(() => client.connect(432 as any, null)).to.throw(TypeError);
      expect(() => client.connect(null, null)).to.throw(TypeError);
      expect(() => client.connect(['String', 'array'] as any, null)).to.throw(TypeError);
      expect(() => client.connect(LOCALHOST, 123 as any)).to.throw(TypeError);
      expect(() => client.connect(LOCALHOST, null)).to.throw(TypeError);
      expect(() => client.connect(LOCALHOST, 'test string' as any)).to.throw(TypeError);
      expect(() => client.connect(LOCALHOST, {} as any)).to.throw(TypeError);
    });
    it('should connect and initiate the Hello handshake.', (done) => {
      Mapper.mapIds({ 16: PacketType.HELLO });
      const client = new Client(mockAccountInfo);
      client.attach(new net.Socket());
      server.once('connection', (socket) => {
        socket.once('data', (data) => {
          expect(data.readInt32BE(0)).to.equal(408, 'Incorrect packet length.');
          expect(data.readInt8(4)).to.equal(16, 'Incorrect packet id.');
          socket.destroy();
          done();
        });
      });
      client.connect(LOCALHOST, {
        buildVersion: 'X20.0.0',
        gameId: -2,
        key: [],
        keyTime: 0,
        characterId: 1
      });
    });
    it('should return a promise which resolves when the Hello handshake is complete.', () => {
      Mapper.mapIds({ 16: PacketType.HELLO, 8: PacketType.CREATE_SUCCESS });
      const client = new Client(mockAccountInfo);
      client.attach(new net.Socket());
      server.once('connection', (socket) => {
        socket.once('data', () => {
          const reply = Buffer.alloc(13);
          reply.writeInt32BE(13, 0);
          reply.writeInt8(8, 4);
          socket.write(reply);
        });
      });
      return client.connect(LOCALHOST, {
        buildVersion: 'X20.0.0',
        gameId: -2,
        key: [],
        keyTime: 0,
        characterId: 1
      }).then(() => {
        expect(client.connected).to.equal(true, 'Client not connected.');
        client.io.socket.destroy();
      });
    });
  });
  describe('#disconnect()', () => {
    const server = net.createServer();
    beforeEach((done) => {
      server.listen(2050, '0.0.0.0', () => {
        done();
      });
    });
    afterEach((done) => {
      server.close(() => {
        done();
      });
    });
    it('should disconnect the client if it is currently connected.', (done) => {
      const client = new Client(mockAccountInfo);
      client.attach(new net.Socket());
      server.once('connection', (socket) => {
        socket.once('close', () => {
          expect(client.connected).to.equal(false, 'Client not disconnected.');
          done();
        });
      });
      client.io.socket.connect(2050, '0.0.0.0', () => {
        client.disconnect();
      });
    });
    it('should return a promise which resolves when the client has disconnected.', (done) => {
      const client = new Client(mockAccountInfo);
      client.attach(new net.Socket());
      client.io.socket.connect(2050, '0.0.0.0', () => {
        client.disconnect().then(() => {
          expect(client.connected).to.equal(false, 'Client not disconnected.');
          done();
        });
      });
    });
  });
  describe('#attach()', () => {
    it('should throw a TypeError for invalid inputs.', () => {
      const client = new Client(mockAccountInfo);
      expect(() => client.attach(123 as any)).to.throw(TypeError);
      expect(() => client.attach('Hello, World!' as any)).to.throw(TypeError);
      expect(() => client.attach(null)).to.throw(TypeError);
    });

    it('should attach event listeners to the socket.', () => {
      const socket = new net.Socket();
      const client = new Client(mockAccountInfo);
      client.attach(socket);
      // there are 2 listeners here because the Packet IO is also attached.
      expect(socket.listenerCount('connect')).to.equal(2, 'Incorrect listener count for connect event.');
      expect(socket.listenerCount('close')).to.equal(1, 'Incorrect listener count for close event.');
    });
    it('#should detach first if there is a socket already attached.', () => {
      const socketA = new net.Socket();
      const socketB = new net.Socket();
      const client = new Client(mockAccountInfo);
      client.attach(socketA);
      client.attach(socketB);
      expect(socketA.listenerCount('connect')).to.equal(0, 'Incorrect listener count for connect event.');
      expect(socketA.listenerCount('close')).to.equal(0, 'Incorrect listener count for close event.');
    });
  });
  describe('#detach()', () => {
    it('should remove the event listeners from the socket.', () => {
      const socket = new net.Socket();
      socket.on('connect', () => null);
      socket.on('close', () => null);
      const client = new Client(mockAccountInfo);
      client.attach(socket);
      client.detach();
      expect(socket.listenerCount('connect')).to.equal(1, 'Incorrect listener count for connect event.');
      expect(socket.listenerCount('close')).to.equal(1, 'Incorrect listener count for close event.');
    });
  });
});
