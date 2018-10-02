/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to change the client's offer in the current active trade.
 */
export class ChangeTradePacket implements Packet {

  type = PacketType.CHANGETRADE;
  propagate = true;

  //#region packet-specific members
  /**
   * A description of which items in the client's inventory are selected.
   * Items 0-3 are the hotbar items, and 4-12 are the 8 inventory slots.
   *
   * If a value is `true`, then the item is selected.
   */
  offer: boolean[];
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeShort(this.offer.length);
    for (const slot of this.offer) {
      buffer.writeBoolean(slot);
    }
  }

  read(buffer: PacketBuffer): void {
    this.offer = new Array(buffer.readShort());
    for (let i = 0; i < this.offer.length; i++) {
      this.offer[i] = buffer.readBoolean();
    }
  }
}
