/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to change the client's account name.
 */
export class ChooseNamePacket implements Packet {

  type = PacketType.CHOOSENAME;
  propagate = true;

  //#region packet-specific members
  /**
   * The name to change the account's name to.
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
