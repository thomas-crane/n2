/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * > Unknown.
 */
export class KeyInfoResponsePacket implements Packet {

  type = PacketType.KEY_INFO_RESPONSE;
  propagate = true;

  //#region packet-specific members
  /**
   * > Unknown.
   */
  name: string;
  /**
   * > Unknown.
   */
  description: string;
  /**
   * > Unknown.
   */
  creator: string;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.name = buffer.readString();
    this.description = buffer.readString();
    this.creator = buffer.readString();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeString(this.name);
    buffer.writeString(this.description);
    buffer.writeString(this.creator);
  }
}
