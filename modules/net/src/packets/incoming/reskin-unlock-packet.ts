/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Received to notify the player that a new skin has been unlocked.
 */
export class ReskinUnlockPacket implements Packet {

  type = PacketType.RESKIN_UNLOCK;
  propagate = true;

  //#region packet-specific members
  /**
   * The id of the skin that was unlocked.
   */
  skinId: number;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.skinId = buffer.readInt32();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.skinId);
  }
}
