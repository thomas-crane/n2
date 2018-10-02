/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * > Unknown.
 */
export class KeyInfoRequestPacket implements Packet {

  type = PacketType.KEY_INFO_REQUEST;
  propagate = true;

  //#region packet-specific members
  /**
   * > Unknown.
   */
  itemType: number;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.itemType);
  }

  read(buffer: PacketBuffer): void {
    this.itemType = buffer.readInt32();
  }
}
