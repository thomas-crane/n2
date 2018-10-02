/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Received in response to a `CreatePacket`.
 */
export class CreateSuccessPacket implements Packet {

  type = PacketType.CREATE_SUCCESS;
  propagate = true;

  //#region packet-specific members
  /**
   * The object id of the player's character.
   */
  objectId: number;
  /**
   * The character id of the player's character.
   */
  charId: number;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.objectId = buffer.readInt32();
    this.charId = buffer.readInt32();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.objectId);
    buffer.writeInt32(this.charId);
  }
}
