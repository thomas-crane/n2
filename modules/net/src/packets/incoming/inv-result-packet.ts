/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * > Unknown.
 */
export class InvResultPacket implements Packet {

  type = PacketType.INVRESULT;
  propagate = true;

  //#region packet-specific members
  /**
   * > Unknown.
   */
  result: number;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.result = buffer.readInt32();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.result);
  }
}
