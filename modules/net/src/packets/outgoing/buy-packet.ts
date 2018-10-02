/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to buy an item.
 */
export class BuyPacket implements Packet {

  type = PacketType.BUY;
  propagate = true;

  //#region packet-specific members
  /**
   * The object id of the item being purchased.
   */
  objectId: number;
  /**
   * The number of items being purchased.
   */
  quantity: number;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.objectId);
    buffer.writeInt32(this.quantity);
  }

  read(buffer: PacketBuffer): void {
    this.objectId = buffer.readInt32();
    this.quantity = buffer.readInt32();
  }
}
