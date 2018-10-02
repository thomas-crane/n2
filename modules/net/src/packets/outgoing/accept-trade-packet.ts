/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to accept the current active trade.
 */
export class AcceptTradePacket implements Packet {

  type = PacketType.ACCEPTTRADE;
  propagate = true;

  //#region packet-specific members
  /**
   * A description of which items in the client's inventory are selected.
   * Items 0-3 are the hotbar items, and 4-12 are the 8 inventory slots.
   *
   * If a value is `true`, then the item is selected.
   */
  clientOffer: boolean[];
  /**
   * A description of which items in the trade partner's inventory are selected.
   * Items 0-3 are the hotbar items, and 4-12 are the 8 inventory slots.
   *
   * If a value is `true`, then the item is selected.
   */
  partnerOffer: boolean[];
  //#endregion

  constructor() {
    this.clientOffer = [];
    this.partnerOffer = [];
  }

  write(buffer: PacketBuffer): void {
    buffer.writeShort(this.clientOffer.length);
    for (const slot of this.clientOffer) {
      buffer.writeBoolean(slot);
    }
    buffer.writeShort(this.partnerOffer.length);
    for (const slot of this.partnerOffer) {
      buffer.writeBoolean(slot);
    }
  }

  read(buffer: PacketBuffer): void {
    this.clientOffer = new Array(buffer.readShort());
    for (let i = 0; i < this.clientOffer.length; i++) {
      this.clientOffer[i] = buffer.readBoolean();
    }
    this.partnerOffer = new Array(buffer.readShort());
    for (let i = 0; i < this.partnerOffer.length; i++) {
      this.partnerOffer[i] = buffer.readBoolean();
    }
  }
}
