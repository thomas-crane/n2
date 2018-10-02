/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * > Unknown.
 */
export class SquareHitPacket implements Packet {

  type = PacketType.SQUAREHIT;
  propagate = true;

  //#region packet-specific members
  /**
   * The current client time.
   */
  time: number;
  /**
   * > Unknown.
   */
  bulletId: number;
  /**
   * > Unknown.
   */
  objectId: number;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.time);
    buffer.writeByte(this.bulletId);
    buffer.writeInt32(this.objectId);
  }

  read(buffer: PacketBuffer): void {
    this.time = buffer.readInt32();
    this.bulletId = buffer.readByte();
    this.objectId = buffer.readInt32();
  }
}
