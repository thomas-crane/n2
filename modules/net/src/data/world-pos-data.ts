/**
 * @module net/data
 */
import { PacketBuffer } from '../packet-buffer';
import { DataPacket } from '../packet';
import { Point } from '@n2/common';

export class WorldPosData extends Point implements DataPacket {

  read(packet: PacketBuffer): void {
    this.x = packet.readFloat();
    this.y = packet.readFloat();
  }

  write(packet: PacketBuffer): void {
    packet.writeFloat(this.x);
    packet.writeFloat(this.y);
  }
  /**
   * Returns a new `WorldPosData` object with the same X/Y coordinates.
   */
  clone(): WorldPosData {
    const clone = new WorldPosData();
    clone.x = this.x;
    clone.y = this.y;
    return clone;
  }
}
