/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../../packet-buffer';
import { PacketType } from '../../../packet-type';
import { Packet } from '../../../packet';

/**
 * Sent to enter the arena.
 */
export class EnterArenaPacket implements Packet {

  type = PacketType.ENTER_ARENA;
  propagate = true;

  //#region packet-specific members
  /**
   * > Unknown.
   */
  currency: number;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.currency);
  }

  read(buffer: PacketBuffer): void {
    this.currency = buffer.readInt32();
  }
}
