/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to activate a new skin for the current character.
 */
export class ReskinPacket implements Packet {

  type = PacketType.RESKIN;
  propagate = true;

  //#region packet-specific members
  /**
   * The id of the skin to activate.
   */
  skinId: number;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.skinId);
  }

  read(buffer: PacketBuffer): void {
    this.skinId = buffer.readInt32();
  }
}
