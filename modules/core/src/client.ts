/**
 * @module core
 */
import { Account, GameState } from './models';
import { Socket } from 'net';
import {
  PacketIO, HelloPacket, PacketType,
  UpdateAckPacket, GotoPacket, GotoAckPacket,
  WorldPosData, AoeAckPacket,
  MovePacket, NewTickPacket, PingPacket,
  PongPacket, UpdatePacket, CreateSuccessPacket,
  LoadPacket, CreatePacket, MapInfoPacket
} from '@n2/net';
import { Logger, LogLevel, Classes, PlayerData } from '@n2/common';
import { StatusParser } from './parsers';
import { MapInfo } from './models/map';

/**
 * A lightweight client for a clientless application
 * which will reply to any necessary packets in order to stay connected.
 */
export class Client {

  //#region Game state
  /**
   * The object id of this client when connected,
   * and `undefined` if the client is not connected.
   */
  objectId: number;
  /**
   * The current position of this client when connected,
   * and `undefined` if the client is not connected
   */
  position: WorldPosData;
  /**
   * The stat data of this client when it is connected, and `undefined`
   * if the client is not connected.
   */
  stats: PlayerData;
  /**
   * The map which the client is currently connected to,
   * or `undefined` if the client is not connected.
   */
  map: MapInfo;
  //#endregion

  /**
   * Information about this client's account.
   */
  account: Account;
  /**
   * @readonly
   * Whether or not the socket is currently connected.
   */
  get connected(): boolean {
    return this._connected;
  }
  /**
   * The packet interface for this client.
   */
  readonly io: PacketIO;
  /**
   * @readonly
   * The time in milliseconds since this client was created.
   */
  get time(): number {
    return Date.now() - this._time;
  }

  private _connected: boolean;
  private _time: number;

  private eventHandlers: Map<string, (...args: any[]) => void>;

  /**
   * Creates a new client for the specified account.
   * @param account The account to create this client for.
   */
  constructor(account: Account, socket?: Socket) {
    if (typeof account.guid !== 'string' && typeof account.password !== 'string') {
      throw new TypeError(`Parameter "account" must be an Account, not ${typeof account}`);
    }
    if (socket && !(socket instanceof Socket)) {
      throw new TypeError(`Parameter "socket" must be a Socket, not ${typeof socket}`);
    }
    this.account = account;
    this._connected = false;
    this.io = new PacketIO(socket || new Socket());
    this._time = Date.now();
    this.eventHandlers = new Map([
      ['connect', this.onConnect.bind(this)],
      ['close', this.onClose.bind(this)],
      ['error', this.onError.bind(this)],
    ]);

    for (const kvp of this.eventHandlers) {
      this.io.socket.on(kvp[0], kvp[1]);
    }

    this.io
      .on(PacketType.CREATE_SUCCESS, (createSuccess: CreateSuccessPacket) => {
        this.objectId = createSuccess.objectId;
        Logger.log('Client', 'Client connected.', LogLevel.Success);
      })
      .on(PacketType.MAPINFO, (mapInfo: MapInfoPacket) => {
        this.map = {
          name: mapInfo.name,
          size: mapInfo.width,
          tiles: {}
        };
      })
      .on(PacketType.UPDATE, (update: UpdatePacket) => {
        this.io.send(new UpdateAckPacket());
        for (const tile of update.tiles) {
          this.map.tiles[tile.x + tile.y * this.map.size] = tile;
        }
        if (!this.position) {
          for (const newObj of update.newObjects) {
            if (newObj.status.objectId === this.objectId) {
              this.stats = StatusParser.parseObject(newObj);
              this.position = newObj.status.pos.clone();
              break;
            }
          }
        }
      })
      .on(PacketType.GOTO, (goto: GotoPacket) => {
        const ack = new GotoAckPacket();
        ack.time = this.time;
        this.io.send(ack);
        if (goto.objectId === this.objectId) {
          this.position = goto.position.clone();
        }
      })
      .on(PacketType.AOE, () => {
        const ack = new AoeAckPacket();
        ack.time = this.time;
        ack.position = this.position.clone();
        this.io.send(ack);
      })
      .on(PacketType.NEWTICK, (newTick: NewTickPacket) => {
        const ack = new MovePacket();
        ack.tickId = newTick.tickId;
        ack.time = this.time;
        ack.newPosition = this.position.clone();
        this.io.send(ack);
        for (const status of newTick.statuses) {
          if (status.objectId === this.objectId) {
            this.stats = StatusParser.processObjectStatus(status, this.stats);
            break;
          }
        }
      })
      .on(PacketType.PING, (ping: PingPacket) => {
        const ack = new PongPacket();
        ack.serial = ping.serial;
        ack.time = this.time;
        this.io.send(ack);
      });
  }

  /**
   * Connects to the specified IP with the given state.
   * @param ip The IP to connect to.
   * @param gameState The state to use when connecting.
   */
  connect(ip: string, gameState: GameState): Promise<void> {
    if (typeof ip !== 'string') {
      throw new TypeError(`Parameter "ip" must be a string, not ${typeof ip}`);
    }
    if (
      !gameState
      || typeof gameState.buildVersion !== 'string'
      || typeof gameState.characterId !== 'number'
      || typeof gameState.gameId !== 'number'
    ) {
      throw new TypeError(`Parameter "gameState" must be a GameState, not ${typeof gameState}`);
    }
    if (this._connected) {
      this.io.socket.destroy();
    }
    this.io.socket.connect(2050, ip, () => {
      const helloPacket: HelloPacket = new HelloPacket();
      helloPacket.buildVersion = gameState.buildVersion;
      helloPacket.gameId = gameState.gameId;
      helloPacket.guid = this.account.guid;
      helloPacket.password = this.account.password;
      helloPacket.keyTime = gameState.keyTime;
      helloPacket.key = gameState.key;
      helloPacket.gameNet = 'rotmg';
      helloPacket.playPlatform = 'rotmg';
      this.io.send(helloPacket);
      this.io.once(PacketType.MAPINFO, () => {
        if (gameState.characterId > 0) {
          const load = new LoadPacket();
          load.charId = gameState.characterId;
          load.isFromArena = false;
          this.io.send(load);
        } else {
          const create = new CreatePacket();
          create.classType = Classes.Wizard;
          create.skinType = 0;
          this.io.send(create);
        }
      });
    });
    return new Promise((resolve) => {
      this.io.once(PacketType.CREATE_SUCCESS, () => resolve());
    });
  }

  /**
   * Disconnects the client from the current server.
   */
  disconnect(): Promise<void> {
    if (this._connected) {
      return new Promise((resolve) => {
        this.io.socket.once('close', () => resolve());
        this.io.socket.destroy();
      });
    } else {
      return Promise.resolve();
    }
  }

  /**
   * Destroys the resources held by this client.
   */
  destroy() {
    this.io.destroy();
    for (const kvp of this.eventHandlers) {
      this.io.socket.removeListener(kvp[0], kvp[1]);
    }
    this.eventHandlers.clear();
    this.io.socket.destroy();
  }

  private onConnect() {
    this._connected = true;
    Logger.log('Client', 'Socket connected.', LogLevel.Success);
  }

  private onClose() {
    this._connected = false;
    this.position = undefined;
    this.objectId = undefined;
    Logger.log('Client', 'Socket closed.', LogLevel.Warning);
  }

  private onError(error: Error) {
    Logger.log('Client', `Socket error: ${error.message}`, LogLevel.Error);
  }
}
