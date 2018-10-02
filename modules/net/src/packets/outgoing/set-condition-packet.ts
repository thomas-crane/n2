/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent when the player inflicts a condition effect.
 */
export class SetConditionPacket implements Packet {

  type = PacketType.SETCONDITION;
  propagate = true;

  //#region packet-specific members
  /**
   * The condition effect being conflicted.
   */
  conditionEffect: number;
  /**
   * The duration of the conditin effect.
   */
  conditionDuration: number;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeByte(this.conditionEffect);
    buffer.writeFloat(this.conditionDuration);
  }

  read(buffer: PacketBuffer): void {
    this.conditionEffect = buffer.readByte();
    this.conditionDuration = buffer.readFloat();
  }
}
