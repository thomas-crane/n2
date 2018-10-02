/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to create a new character.
 */
export class CreatePacket implements Packet {

  type = PacketType.CREATE;
  propagate = true;

  //#region packet-specific members
  /**
   * The class to use for the new character.
   */
  classType: number;
  /**
   * The skin id to use for the new character.
   * The default skin id is `0`.
   */
  skinType: number;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeShort(this.classType);
    buffer.writeShort(this.skinType);
  }

  read(buffer: PacketBuffer): void {
    this.classType = buffer.readShort();
    this.skinType = buffer.readShort();
  }
}
