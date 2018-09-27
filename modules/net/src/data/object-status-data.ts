/**
 * @module net/data
 */
import { PacketBuffer } from '../packet-buffer';
import { DataPacket } from '../packet';
import { WorldPosData } from './world-pos-data';
import { StatData } from './stat-data';
import { StatType, PlayerData } from '@n2/common';
import { ObjectData } from './object-data';

export class ObjectStatusData implements DataPacket {

  /**
   * The object id of the object which this status is for.
   */
  objectId: number;
  /**
   * The position of the object which this status is for.
   */
  pos: WorldPosData;
  /**
   * A list of stats for the object which this status is for.
   */
  stats: StatData[];

  read(packet: PacketBuffer): void {
    this.objectId = packet.readInt32();
    this.pos = new WorldPosData();
    this.pos.read(packet);
    const statLen = packet.readShort();
    this.stats = new Array(statLen);
    for (let i = 0; i < statLen; i++) {
      const sd = new StatData();
      sd.read(packet);
      this.stats[i] = sd;
    }
  }

  write(packet: PacketBuffer): void {
    packet.writeInt32(this.objectId);
    this.pos.write(packet);
    packet.writeShort(this.stats.length);
    for (const stat of this.stats) {
      stat.write(packet);
    }
  }
}
