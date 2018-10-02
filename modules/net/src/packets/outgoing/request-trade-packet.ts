/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to request a trade with a player, as well as
 * to accept a pending trade with a player.
 */
export class RequestTradePacket implements Packet {

  type = PacketType.REQUESTTRADE;
  propagate = true;

  //#region packet-specific members
  /**
   * The name of the player to request the trade with.
   */
  name: string;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeString(this.name);
  }

  read(buffer: PacketBuffer): void {
    this.name = buffer.readString();
  }
}
