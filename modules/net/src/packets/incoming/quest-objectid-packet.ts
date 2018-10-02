/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Received to tell the player the object id of their current quest.
 */
export class QuestObjectIdPacket implements Packet {

  type = PacketType.QUESTOBJID;
  propagate = true;

  //#region packet-specific members
  /**
   * The object id of the current quest.
   */
  objectId: number;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.objectId = buffer.readInt32();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.objectId);
  }
}
