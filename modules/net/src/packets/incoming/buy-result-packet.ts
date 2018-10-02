/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Received in response to a `BuyPacket`.
 */
export class BuyResultPacket implements Packet {

  type = PacketType.BUYRESULT;
  propagate = true;

  //#region packet-specific members
  /**
   * The result code.
   */
  result: number;
  /**
   * > Unknown.
   */
  resultString: string;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.result = buffer.readInt32();
    this.resultString = buffer.readString();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.result);
    buffer.writeString(this.resultString);
  }
}
