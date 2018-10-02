/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to remove a player from the client's current guild.
 */
export class GuildRemovePacket implements Packet {

  type = PacketType.GUILDREMOVE;
  propagate = true;

  //#region packet-specific members
  /**
   * The name of the player to remove.
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
