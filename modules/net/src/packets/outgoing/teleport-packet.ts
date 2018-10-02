/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to teleport to another player.
 */
export class TeleportPacket implements Packet {

  type = PacketType.TELEPORT;
  propagate = true;

  //#region packet-specific members
  /**
   * The object id of the player to teleport to.
   */
  objectId: number;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.objectId);
  }

  read(buffer: PacketBuffer): void {
    this.objectId = buffer.readInt32();
  }
}
