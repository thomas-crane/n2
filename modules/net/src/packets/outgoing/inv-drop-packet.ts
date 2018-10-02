/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';
import { SlotObjectData } from '../../data/slot-object-data';

/**
 * Sent to drop an item from the client's inventory.
 */
export class InvDropPacket implements Packet {

  type = PacketType.INVDROP;
  propagate = true;

  //#region packet-specific members
  /**
   * The slot to drop the item from.
   */
  slotObject: SlotObjectData;
  //#endregion

  write(buffer: PacketBuffer): void {
    this.slotObject.write(buffer);
  }

  read(buffer: PacketBuffer): void {
    this.slotObject = new SlotObjectData();
    this.slotObject.read(buffer);
  }
}
