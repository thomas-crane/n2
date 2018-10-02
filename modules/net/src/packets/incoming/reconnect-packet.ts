/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Received to instruct the client to connect to a new host.
 */
export class ReconnectPacket implements Packet {

  type = PacketType.RECONNECT;
  propagate = true;

  //#region packet-specific members
  /**
   * The name of the new host.
   */
  name: string;
  /**
   * The address of the new host.
   */
  host: string;
  /**
   * > Unknown.
   */
  stats: string;
  /**
   * The port of the new host.
   */
  port: number;
  /**
   * The `gameId` to send in the next `HelloPacket`.
   */
  gameId: number;
  /**
   * The `keyTime` to send in the next `HelloPacket`.
   */
  keyTime: number;
  /**
   * The `key` to send in the next `HelloPacket`.
   */
  key: number[];
  /**
   * Whether or not the new host is from the arena.
   */
  isFromArena: boolean;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.name = buffer.readString();
    this.host = buffer.readString();
    this.stats = buffer.readString();
    this.port = buffer.readInt32();
    this.gameId = buffer.readInt32();
    this.keyTime = buffer.readInt32();
    this.isFromArena = buffer.readBoolean();
    this.key = buffer.readByteArray();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeString(this.name);
    buffer.writeString(this.host);
    buffer.writeString(this.stats);
    buffer.writeInt32(this.port);
    buffer.writeInt32(this.gameId);
    buffer.writeInt32(this.keyTime);
    buffer.writeBoolean(this.isFromArena);
    buffer.writeByteArray(this.key);
  }
}
