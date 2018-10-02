/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';
import { WorldPosData } from '../../data/world-pos-data';

/**
 * Sent to acknowledge an `AoePacket`.
 */
export class AoeAckPacket implements Packet {

  type = PacketType.AOEACK;
  propagate = true;

  //#region packet-specific members
  /**
   * The current client time.
   */
  time: number;
  /**
   * The position of the AoE which this packet is acknowledging.
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
