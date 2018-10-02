/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Received to tell the player about damage done to other players and enemies.
 */
export class DamagePacket implements Packet {

  type = PacketType.DAMAGE;
  propagate = true;

  //#region packet-specific members
  /**
   * The object id of the entity receiving the damage.
   */
  targetId: number;
  /**
   * An array of status effects which were applied with the damage.
   */
  effects: number[];
  /**
   * The amount of damage taken.
   */
  damageAmount: number;
  /**
   * Whether or not the damage resulted in killing the entity.
   */
  kill: boolean;
  /**
   * Whether or not the damage was armor piercing.
   */
  armorPierce: boolean;
  /**
   * The id of the bullet which caused the damage.
   */
  bulletId: number;
  /**
   * The object id of the entity which owned the bullet that caused the damage.
   */
  objectId: number;
  //#endregion

  constructor() {
    this.effects = [];
  }

  read(buffer: PacketBuffer): void {
    this.targetId = buffer.readInt32();
    const effectsLen = buffer.readUnsignedByte();
    this.effects = new Array<number>(effectsLen);
    for (let i = 0; i < effectsLen; i++) {
      this.effects[i] = buffer.readUnsignedByte();
    }
    this.damageAmount = buffer.readUnsignedShort();
    this.kill = buffer.readBoolean();
    this.armorPierce = buffer.readBoolean();
    this.bulletId = buffer.readUnsignedByte();
    this.objectId = buffer.readInt32();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.targetId);
    buffer.writeUnsignedByte(this.effects.length);
    for (const effect of this.effects) {
      buffer.writeUnsignedByte(effect);
    }
    buffer.writeUnsignedShort(this.damageAmount);
    buffer.writeBoolean(this.kill);
    buffer.writeBoolean(this.armorPierce);
    buffer.writeUnsignedByte(this.bulletId);
    buffer.writeInt32(this.objectId);
  }
}
