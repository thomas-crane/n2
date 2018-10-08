/**
 * @module core
 */
import { Account, GameState, isGameState, Server } from './models';
import { Socket, createConnection } from 'net';
import {
  PacketIO, HelloPacket, PacketType,
  UpdateAckPacket, GotoPacket, GotoAckPacket,
  WorldPosData, AoeAckPacket,
  MovePacket, NewTickPacket, PingPacket,
  PongPacket, UpdatePacket, CreateSuccessPacket,
  LoadPacket, CreatePacket, MapInfoPacket,
  RSA
} from '@n2/net';
import { Logger, LogLevel, Classes, PlayerData } from '@n2/common';
import { StatusParser } from './parsers';
import { MapInfo } from './models/map';
import { SocksClient } from 'socks';
import { Proxy } from './models/proxy';

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
   * A proxy to route game traffic through.
   */
  proxy: Proxy;
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

  /**
   * The last server that this client was connected to.
   */
  get lastServer(): Server {
    return this._lastServer;
  }

  private _connected: boolean;
  private _time: number;
  private _lastServer: Server;

  private eventHandlers: Map<string, (...args: any[]) => void>;

  /**
   * Creates a new client for the specified account.
   * @param account The account to create this client for.
   */
  constructor(account: Account) {
    if (!account || typeof account.guid !== 'string' && typeof account.password !== 'string') {
      throw new TypeError(`Parameter "account" must be an Account, not ${typeof account}`);
    }
    this.account = account;
    if (!this.account.name) {
      let crypto = require('crypto');
      this.account.name = `Client ${crypto.randomBytes(2).toString('hex')}`;
      crypto = null;
    }
    this._connected = false;
    this.io = new PacketIO();
    this._time = Date.now();
    this.eventHandlers = new Map([
      ['connect', this.onConnect.bind(this)],
      ['close', this.onClose.bind(this)],
      ['error', this.onError.bind(this)],
    ]);

    this.io
      .on(PacketType.CREATE_SUCCESS, (createSuccess: CreateSuccessPacket) => {
        this.objectId = createSuccess.objectId;
        this.log('Client connected.', LogLevel.Success);
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
   * Attaches the client to the `Socket`.
   * @param socket The socket to attach to.
   */
  attach(socket: Socket): void {
    if (!(socket instanceof Socket)) {
      throw new TypeError(`Parameter "socket" should be a Socket, not ${typeof socket}`);
    }
    if (this.io.socket) {
      this.detach();
    }
    this.io.attach(socket);
    for (const kvp of this.eventHandlers) {
      this.io.socket.on(kvp[0], kvp[1]);
    }
  }

  /**
   * Detaches this client from its socket.
   */
  detach(): void {
    if (this.io.socket) {
      for (const kvp of this.eventHandlers) {
        this.io.socket.removeListener(kvp[0], kvp[1]);
      }
      this.io.socket.destroy();
      this.io.detach();
    }
  }

  /**
   * Connects to the specified IP with the given state.
   * @param ip The IP to connect to.
   * @param gameState The state to use when connecting.
   */
  connect(server: Server, gameState: GameState): Promise<void> {
    if (!server || typeof server.ip !== 'string') {
      throw new TypeError(`Parameter "server" must be a Server, not ${typeof server}`);
    }
    if (!isGameState(gameState)) {
      throw new TypeError(`Parameter "gameState" must be a GameState, not ${typeof gameState}`);
    }

    if (this.io.socket) {
      this.detach();
    }

    return this.getConnection(server.ip).then((socket) => {
      this._lastServer = server;
      this.onConnect();
      this.attach(socket);
      const helloPacket: HelloPacket = new HelloPacket();
      helloPacket.buildVersion = gameState.buildVersion;
      helloPacket.gameId = gameState.gameId;
      helloPacket.guid = RSA.encrypt(this.account.guid);
      helloPacket.password = RSA.encrypt(this.account.password);
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
      return new Promise<void>((resolve) => {
        this.io.once(PacketType.CREATE_SUCCESS, () => resolve());
      });
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

  private getConnection(ip: string): Promise<Socket> {
    if (this.proxy) {
      return SocksClient.createConnection({
        proxy: {
          ipaddress: this.proxy.host,
          port: this.proxy.port,
          type: this.proxy.type,
          userId: this.proxy.userId,
          password: this.proxy.password
        },
        command: 'connect',
        destination: {
          host: ip,
          port: 2050
        }
      }).then((established) => {
        this.log('Proxy connected.', LogLevel.Success);
        return established.socket;
      });
    } else {
      return new Promise((resolve, reject) => {
        const socket = createConnection(2050, ip, () => {
          socket.removeAllListeners('error');
          resolve(socket);
        }).once('error', reject);
      });
    }
  }

  private onConnect() {
    if (!this._lastServer) {
      this._lastServer = {
        name: 'Unknown server.',
        ip: this.io.socket.remoteAddress,
        usage: 0,
        location: {
          lat: 0,
          long: 0
        }
      };
    }
    this.log(`Socket connected to ${this.lastServer.name || this.lastServer.ip}.`, LogLevel.Success);
    this._connected = true;
  }

  private onClose() {
    this._connected = false;
    this.position = undefined;
    this.objectId = undefined;
    this.log('Socket closed.', LogLevel.Warning);
  }

  private onError(error: Error) {
    this.log(`Socket error: ${error.message}`, LogLevel.Error);
  }

  private log(msg: string, level: LogLevel = LogLevel.Message): void {
    let name = 'Client';
    if (this.account && this.account.name) {
      name = this.account.name;
    }
    Logger.log(name, msg, level);
  }
}
