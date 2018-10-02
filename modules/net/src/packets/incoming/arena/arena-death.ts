/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../../packet-buffer';
import { PacketType } from '../../../packet-type';
import { Packet } from '../../../packet';

/**
 * Received when the player has been killed in the arena.
 */
export class ArenaDeathPacket implements Packet {

  type = PacketType.ARENA_DEATH;
  propagate = true;

  //#region packet-specific members
  /**
   * The cost in gold to be revived.
   */
  cost: number;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.cost = buffer.readInt32();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.cost);
  }
}
