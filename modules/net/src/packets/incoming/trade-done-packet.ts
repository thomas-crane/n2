/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { IncomingPacket } from '../../packet';
import { TradeResult } from '@n2/common';

/**
 * Received when the active trade has completed, regardless of whether
 * it was accepted or cancelled.
 */
export class TradeDonePacket implements IncomingPacket {

  type = PacketType.TRADEDONE;
  propagate = true;

  //#region packet-specific members
  /**
   * The result of the trade.
   */
  code: TradeResult;
  /**
   * > Unknown.
   */
  description: string;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.code = buffer.readInt32();
    this.description = buffer.readString();
  }
}
