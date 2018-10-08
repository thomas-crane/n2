/**
 * @module net
 */
import { EventEmitter } from 'events';
import { Socket } from 'net';
import { PacketBuffer } from './packet-buffer';
import { Packets } from './packets';
import { RC4, OUTGOING_KEY, INCOMING_KEY } from './crypto';
import { Packet } from './packet';
import { Mapper } from './mapper';
import { PacketType } from './packet-type';
import { Logger, LogLevel } from '@n2/common';

/**
 * The configuration for the RC4 ciphers used by the PacketIO.
 */
export interface RC4Config {
  incomingKey: string;
  outgoingKey: string;
}

const DEFAULT_RC4: RC4Config = {
  incomingKey: INCOMING_KEY,
  outgoingKey: OUTGOING_KEY
};

/**
 * A utility class which implements the RotMG messaging protocol on top of a `Socket`.
 */
export class PacketIO extends EventEmitter {

  /**
   * The socket this packet interface is attached to.
   */
  socket: Socket;

  /**
   * The last packet which was received.
   */
  get lastIncomingPacket(): Packet {
    return this._lastIncomingPacket;
  }

  /**
   * The last packet which was sent.
   */
  get lastOutgoingPacket(): Packet {
    return this._lastOutgoingPacket;
  }

  private sendRC4: RC4;
  private receiveRC4: RC4;

  private packetBuffer: PacketBuffer;
  private outgoingBuffer: PacketBuffer;
  private eventHandlers: Map<string, (...args: any[]) => void>;
  // tslint:disable:variable-name
  private _lastIncomingPacket: Packet;
  private _lastOutgoingPacket: Packet;
  // tslint:enable:variable-name

  /**
   * Creates a new `PacketIO` on top of the given `socket`.
   * @param socket The socket to implement the protocol on top of.
   */
  constructor(socket?: Socket, rc4Config: RC4Config = DEFAULT_RC4) {
    super();
    this.packetBuffer = new PacketBuffer(5);
    this.outgoingBuffer = new PacketBuffer(2048);
    this.sendRC4 = new RC4(Buffer.from(rc4Config.outgoingKey, 'hex'));
    this.receiveRC4 = new RC4(Buffer.from(rc4Config.incomingKey, 'hex'));

    this.eventHandlers = new Map([
      ['data', this.onData.bind(this)],
      ['connect', this.onConnect.bind(this)]
    ]);

    if (socket) {
      this.attach(socket);
    }
  }

  /**
   * Attaches this Packet IO to the `socket`.
   * @param socket The socket to attach to.
   */
  attach(socket: Socket): void {
    if (!(socket instanceof Socket)) {
      throw new TypeError(`Parameter "socket" should be a Socket, not ${typeof socket}`);
    }
    if (this.socket) {
      this.detach();
    }
    this.socket = socket;
    for (const kvp of this.eventHandlers) {
      this.socket.on(kvp[0], kvp[1]);
    }
  }

  /**
   * Detaches this Packet IO from its `Socket`.
   */
  detach(): void {
    for (const kvp of this.eventHandlers) {
      this.socket.removeListener(kvp[0], kvp[1]);
    }
    this.socket = undefined;
    this._lastIncomingPacket = undefined;
    this._lastOutgoingPacket = undefined;
  }

  /**
   * Sends a packet.
   * @param packet The packet to send.
   */
  send(packet: Packet): void {
    if (!this.socket || this.socket.destroyed) {
      return;
    }
    const type = Mapper.reverseMap.get(packet.type);
    if (!type) {
      const error = new Error(`Mapper is missing an id for the packet type ${packet.type}`);
      this.emitError(error);
      return;
    }

    this.outgoingBuffer.bufferIndex = 5;
    packet.write(this.outgoingBuffer);

    const packetSize = this.outgoingBuffer.bufferIndex;
    this.sendRC4.cipher(this.outgoingBuffer.data.slice(5, packetSize));

    this.outgoingBuffer.bufferIndex = 0;
    this.outgoingBuffer.writeInt32(packetSize);
    this.outgoingBuffer.writeByte(type);

    this._lastOutgoingPacket = packet;
    Logger.log('PacketIO', `WRITE: ${packet.type}, size: ${packetSize}`, LogLevel.Debug);

    this.socket.write(this.outgoingBuffer.data.slice(0, packetSize));
  }

  /**
   * Emits a packet from this PacketIO instance. This will only
   * emit the packet to the clients subscribed to this particular PacketIO.
   * @param packet The packet to emit.
   */
  emitPacket(packet: Packet): void {
    if (packet && typeof packet.type === 'string') {
      this._lastIncomingPacket = packet;
      this.emit(packet.type, packet);
      this.emit('packet', packet);
    } else {
      throw new TypeError(`Parameter "packet" must be a Packet, not ${typeof packet}`);
    }
  }

  private onConnect(): void {
    this.resetBuffer();
    this.sendRC4.reset();
    this.receiveRC4.reset();
  }

  private onData(data: Buffer): void {
    for (const byte of data) {
      // reconnecting to the nexus causes a 'buffer' byte to be sent
      // which should be skipped.
      if (this.packetBuffer.bufferIndex === 0 && byte === 255) {
        continue;
      }
      this.checkBuffer();
      this.packetBuffer.data[this.packetBuffer.bufferIndex++] = byte;
    }
    this.checkBuffer();
  }

  private constructPacket(): Packet {
    this.receiveRC4.cipher(this.packetBuffer.data.slice(5, this.packetBuffer.length));

    let packet: Packet;
    try {
      const id = this.packetBuffer.data.readInt8(4);
      const type = Mapper.map.get(id);
      if (!type) {
        throw new Error(`Mapper is missing a packet type for the id ${id}`);
      }
      packet = Packets.create(type) as Packet;
    } catch (error) {
      Logger.log('PacketIO', error.message, LogLevel.Error);
      this.emitError(error);
    }
    if (packet) {
      try {
        this.packetBuffer.bufferIndex = 5;
        packet.read(this.packetBuffer);
      } catch (error) {
        Logger.log('PacketIO', `Error while reading ${packet.type}`, LogLevel.Error);
        Logger.log('PacketIO', error.message, LogLevel.Error);
        this.emitError(new Error('Invalid packet structure.'));
        this.resetBuffer();
        return null;
      }
      Logger.log('PacketIO', `READ: ${packet.type}, size: ${this.packetBuffer.length}`, LogLevel.Debug);
    }
    this.resetBuffer();
    return packet;
  }

  private checkBuffer() {
    if (this.packetBuffer.remaining === 0) {
      this.packetBuffer.bufferIndex = 0;
      if (this.packetBuffer.length === 5) {
        const size = this.packetBuffer.readInt32();
        this.packetBuffer.bufferIndex++; // skip the id.
        this.packetBuffer.resizeBuffer(size);
      } else {
        const packet = this.constructPacket();
        this.emitPacket(packet);
      }
    }
  }

  private resetBuffer(): void {
    this.packetBuffer.resizeBuffer(5);
    this.packetBuffer.bufferIndex = 0;
  }

  private emitError(error: Error): void {
    if (this.listenerCount('error') === 0) {
      throw error;
    } else {
      this.emit('error', error);
    }
  }
}
