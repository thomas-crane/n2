/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Received when the player is invited to a guild.
 */
export class InvitedToGuildPacket implements Packet {

  type = PacketType.INVITEDTOGUILD;
  propagate = true;

  //#region packet-specific members
  /**
   * The name of the player who sent the invite.
   */
  name: string;
  /**
   * The name of the guild which the invite is for.
   */
  guildName: string;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.name = buffer.readString();
    this.guildName = buffer.readString();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeString(this.name);
    buffer.writeString(this.guildName);
  }
}
