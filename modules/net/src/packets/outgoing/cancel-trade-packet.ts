/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to cancel the current active trade.
 */
export class CancelTradePacket implements Packet {

  type = PacketType.CANCELTRADE;
  propagate = true;

  //#region packet-specific members

  //#endregion

  write(buffer: PacketBuffer): void {
    //
  }

  read(buffer: PacketBuffer): void {
    //
  }
}
