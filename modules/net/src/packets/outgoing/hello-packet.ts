/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to prompt the server to accept the connection of an account
 * and reply with a `MapInfoPacket`.
 */
export class HelloPacket implements Packet {

  type = PacketType.HELLO;
  propagate = true;

  //#region packet-specific members
  /**
   * The current build version of RotMG.
   */
  buildVersion: string;
  /**
   * The id of the map to connect to.
   */
  gameId: number;
  /**
   * The email of the account being used.
   */
  guid: string;
  /**
   * The password of the account being used.
   */
  password: string;
  /**
   * The client secret of the account being used.
   */
  secret: string;
  /**
   * The key time of the `key` being used.
   */
  keyTime: number;
  /**
   * The key of the map to connect to.
   */
  key: number[];
  /**
   * > Unknown.
   */
  mapJSON: string;
  /**
   * > Unknown.
   */
  entryTag: string;
  /**
   * > Unknown.
   */
  gameNet: string;
  /**
   * > Unknown.
   */
  gameNetUserId: string;
  /**
   * > Unknown.
   */
  playPlatform: string;
  /**
   * > Unknown.
   */
  platformToken: string;
  /**
   * > Unknown.
   */
  userToken: string;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeString(this.buildVersion);
    buffer.writeInt32(this.gameId);
    buffer.writeString(this.guid);
    buffer.writeInt32(Math.floor(Math.random() * 1000000000));
    buffer.writeString(this.password);
    buffer.writeInt32(Math.floor(Math.random() * 1000000000));
    buffer.writeString(this.secret);
    buffer.writeInt32(this.keyTime);
    buffer.writeByteArray(this.key);
    buffer.writeStringUTF32(this.mapJSON);
    buffer.writeString(this.entryTag);
    buffer.writeString(this.gameNet);
    buffer.writeString(this.gameNetUserId);
    buffer.writeString(this.playPlatform);
    buffer.writeString(this.platformToken);
    buffer.writeString(this.userToken);
  }

  read(buffer: PacketBuffer): void {
    this.buildVersion = buffer.readString();
    this.gameId = buffer.readInt32();
    this.guid = buffer.readString();
    buffer.readInt32(); // skip random1
    this.password = buffer.readString();
    buffer.readInt32(); // skip random2.
    this.secret = buffer.readString();
    this.keyTime = buffer.readInt32();
    this.key = buffer.readByteArray();
    this.mapJSON = buffer.readStringUTF32();
    this.entryTag = buffer.readString();
    this.gameNet = buffer.readString();
    this.gameNetUserId = buffer.readString();
    this.playPlatform = buffer.readString();
    this.platformToken = buffer.readString();
    this.userToken = buffer.readString();
  }
}
