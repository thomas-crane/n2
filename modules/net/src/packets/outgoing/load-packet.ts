/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent in response to a `MapInfoPacket` to load a character into the map.
 */
export class LoadPacket implements Packet {

  type = PacketType.LOAD;
  propagate = true;

  //#region packet-specific members
  /**
   * The id of the character to load.
   */
  charId: number;
  /**
   * Whether or not the `MapInfoPacket` being responded to is from the arena.
   */
  isFromArena: boolean;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.charId);
    buffer.writeBoolean(this.isFromArena);
  }

  read(buffer: PacketBuffer): void {
    this.charId = buffer.readInt32();
    this.isFromArena = buffer.readBoolean();
  }
}
