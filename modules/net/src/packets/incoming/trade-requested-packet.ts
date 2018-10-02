/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Received when a trade is requested.
 */
export class TradeRequestedPacket implements Packet {

  type = PacketType.TRADEREQUESTED;
  propagate = true;

  //#region packet-specific members
  /**
   * The name of the player who requested the trade.
   */
  name: string;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.name = buffer.readString();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeString(this.name);
  }
}
