/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to change the guild rank of a member in the player's guild.
 */
export class ChangeGuildRankPacket implements Packet {

  type = PacketType.CHANGEGUILDRANK;
  propagate = true;

  //#region packet-specific members
  /**
   * The name of the player whose rank will change.
   */
  name: string;
  /**
   * The new rank of the player.
   */
  guildRank: number;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeString(this.name);
    buffer.writeInt32(this.guildRank);
  }

  read(buffer: PacketBuffer): void {
    this.name = buffer.readString();
    this.guildRank = buffer.readInt32();
  }
}
