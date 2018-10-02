/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to acknowledge an `EnemyShootPacket`.
 */
export class ShootAckPacket implements Packet {

  type = PacketType.SHOOTACK;
  propagate = true;

  //#region packet-specific members
  /**
   * The current client time.
   */
  time: number;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.time);
  }

  read(buffer: PacketBuffer): void {
    this.time = buffer.readInt32();
  }
}
