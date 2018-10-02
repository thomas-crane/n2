/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';
import { WorldPosData } from '../../data/world-pos-data';

/**
 * Sent when the client takes damage from a ground source, such as lava.
 */
export class GroundDamagePacket implements Packet {

  type = PacketType.GROUNDDAMAGE;
  propagate = true;

  //#region packet-specific members
  /**
   * The current client time.
   */
  time: number;
  /**
   * The current client position.
   */
  position: WorldPosData;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.time);
    this.position.write(buffer);
  }

  read(buffer: PacketBuffer): void {
    this.time = buffer.readInt32();
    this.position = new WorldPosData();
    this.position.read(buffer);
  }
}
