/**
 * @module stdlib
 */
import { Client } from '../client';
import { Socket } from 'net';
import { Account } from '../models';
import { PacketType, UpdatePacket, NewTickPacket } from '@n2/net';
import { PlayerData, Classes } from '@n2/common';
import { EventEmitter } from 'events';
import { StatusParser } from '../parsers';

/**
 * An extended Client class that provides player tracking functionality
 * by exposing a `players` array and an event emitter for `enter` and `leave` events.
 */
export class PlayerTrackerClient extends Client {

  /**
   * An array of all players which are visible to the client.
   */
  players: PlayerData[];
  private emitter: EventEmitter;

  constructor(account: Account) {
    super(account);
    this.emitter = new EventEmitter();
    this.io.on(PacketType.UPDATE, (update: UpdatePacket) => {
      for (const obj of update.newObjects) {
        if (Classes[obj.objectType]) {
          const player = StatusParser.parseObject(obj);
          this.players.push(player);
          this.emitter.emit('enter', player);
        }
      }
      for (const drop of update.drops) {
        for (let i = 0; i < this.players.length; i++) {
          if (this.players[i].objectId === drop) {
            const player = this.players.splice(i, 1);
            this.emitter.emit('leave', ...player);
          }
        }
      }
    });
    this.io.on(PacketType.NEWTICK, (newTick: NewTickPacket) => {
      for (const status of newTick.statuses) {
        for (let i = 0; i < this.players.length; i++) {
          if (this.players[i].objectId === status.objectId) {
            this.players[i] = StatusParser.processObjectStatus(status, this.players[i]);
            break;
          }
        }
      }
    });
    this.io.socket.on('connect', () => {
      this.players = [];
    });
  }

  on(event: 'enter' | 'leave', listener: (player: PlayerData) => void): this {
    this.emitter.on(event, listener);
    return this;
  }
  once(event: 'enter' | 'leave', listener: (player: PlayerData) => void): this {
    this.emitter.once(event, listener);
    return this;
  }
  removeListener(event: 'enter' | 'leave', listener: (player: PlayerData) => void): this {
    this.emitter.removeListener(event, listener);
    return this;
  }
}
