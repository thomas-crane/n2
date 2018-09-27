/**
 * @module net
 */
import { PacketType } from './packet-type';
import { Logger, LogLevel } from '@n2/common';

/**
 * A map from packet ids to packet types.
 */
export interface PacketIdMap {
  [id: number]: PacketType;
}

/**
 * A static singleton class used to store a `PacketIdMap` in memory.
 */
export class Mapper {

  static readonly map: Map<number, PacketType> = new Map<number, PacketType>();
  static readonly reverseMap: Map<PacketType, number> = new Map<PacketType, number>();

  /**
   * Stores the given packet id map, and it's reverse map.
   * @param ids The packet id map.
   */
  static mapIds(ids: PacketIdMap): void {
    if (typeof ids !== 'object' || !ids) {
      throw new Error('Invalid input provided to mapIds');
    }
    this.map.clear();
    this.reverseMap.clear();
    for (const type in ids) {
      if (ids.hasOwnProperty(type)) {
        if (!PacketType.hasOwnProperty(ids[type])) {
          Logger.log('Mapper', `Packet type "${ids[type]}" does not exist in the PacketType enum.`, LogLevel.Warning);
        }
        this.map.set(+type, ids[type]);
        this.reverseMap.set(ids[type], +type);
      }
    }
    Logger.log('Mapper', `Mapped ${this.map.size} packet ids.`, LogLevel.Info);
  }
}
