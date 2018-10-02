/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to create a new guild.
 */
export class CreateGuildPacket implements Packet {

  type = PacketType.CREATEGUILD;
  propagate = true;

  //#region packet-specific members
  /**
   * The name of the guild being created.
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
