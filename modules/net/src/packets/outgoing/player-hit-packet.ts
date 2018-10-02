/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent when the player is hit.
 */
export class PlayerHitPacket implements Packet {

  type = PacketType.PLAYERHIT;
  propagate = true;

  //#region packet-specific members
  /**
   * The id of the bullet which hit the player.
   */
  bulletId: number;
  /**
   * The object id of the enemy that hit the player.
   */
  objectId: number;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeUnsignedByte(this.bulletId);
    buffer.writeInt32(this.objectId);
  }

  read(buffer: PacketBuffer): void {
    this.bulletId = buffer.readUnsignedByte();
    this.objectId = buffer.readInt32();
  }
}
