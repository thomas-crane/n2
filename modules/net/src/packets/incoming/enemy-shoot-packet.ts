/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';
import { WorldPosData } from '../../data/world-pos-data';

/**
 * Received when a visible enemy shoots a projectile.
 */
export class EnemyShootPacket implements Packet {

  type = PacketType.ENEMYSHOOT;
  propagate = true;

  //#region packet-specific members
  /**
   * The id of the bullet which was fired.
   */
  bulletId: number;
  /**
   * The object id of the enemy which fired the projectile.
   */
  ownerId: number;
  /**
   * The local identifier of the projectile.
   * @see `ProjectileInfo.id`
   */
  bulletType: number;
  /**
   * The position at which the projectile was fired.
   */
  startingPos: WorldPosData;
  /**
   * The angle at which the projectile was fired.
   */
  angle: number;
  /**
   * The damage which the projectile will cause.
   */
  damage: number;
  /**
   * The number of projeciles fired.
   */
  numShots: number;
  /**
   * The angle in degrees between the projectiles if `numShots > 1`.
   */
  angleInc: number;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.bulletId = buffer.readUnsignedByte();
    this.ownerId = buffer.readInt32();
    this.bulletType = buffer.readUnsignedByte();
    this.startingPos = new WorldPosData();
    this.startingPos.read(buffer);
    this.angle = buffer.readFloat();
    this.damage = buffer.readShort();
    if (buffer.bufferIndex < buffer.data.length) {
      this.numShots = buffer.readUnsignedByte();
      this.angleInc = buffer.readFloat();
    } else {
      this.numShots = 1;
      this.angleInc = 0;
    }
  }

  write(buffer: PacketBuffer): void {
    buffer.writeUnsignedByte(this.bulletId);
    buffer.writeInt32(this.ownerId);
    buffer.writeUnsignedByte(this.bulletType);
    this.startingPos.write(buffer);
    buffer.writeFloat(this.angle);
    buffer.writeShort(this.damage);
    if (this.numShots !== 1) {
      buffer.writeUnsignedByte(this.numShots);
      buffer.writeFloat(this.angleInc);
    }
  }
}
