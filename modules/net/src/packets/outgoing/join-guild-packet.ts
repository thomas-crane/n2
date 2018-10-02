/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to accept a pending guild invite.
 */
export class JoinGuildPacket implements Packet {

  type = PacketType.JOINGUILD;
  propagate = true;

  //#region packet-specific members
  /**
   * The name of the guild for which there is a pending invite.
   */
  guildName: string;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeString(this.guildName);
  }

  read(buffer: PacketBuffer): void {
    this.guildName = buffer.readString();
  }
}
