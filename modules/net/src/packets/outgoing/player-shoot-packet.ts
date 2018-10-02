/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';
import { WorldPosData } from '../../data/world-pos-data';

/**
 * Sent when the player shoots a projectile.
 */
export class PlayerShootPacket implements Packet {

  type = PacketType.PLAYERSHOOT;
  propagate = true;

  //#region packet-specific members
  /**
   * The current client time.
   */
  time: number;
  /**
   * The id of the bullet which was fired.
   */
  bulletId: number;
  /**
   * The item id of the weapon used to fire the projectile.
   */
  containerType: number;
  /**
   * The position at which the projectile was fired.
   */
  startingPos: WorldPosData;
  /**
   * The angle at which the projectile was fired.
   */
  angle: number;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.time);
    buffer.writeByte(this.bulletId);
    buffer.writeShort(this.containerType);
    this.startingPos.write(buffer);
    buffer.writeFloat(this.angle);
  }

  read(buffer: PacketBuffer): void {
    this.time = buffer.readInt32();
    this.bulletId = buffer.readByte();
    this.containerType = buffer.readShort();
    this.startingPos = new WorldPosData();
    this.startingPos.read(buffer);
    this.angle = buffer.readFloat();
  }
}
