/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to invite a player to the client's current guild.
 */
export class GuildInvitePacket implements Packet {

  type = PacketType.GUILDINVITE;
  propagate = true;

  //#region packet-specific members
  /**
   * The name of the player to invite.
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
