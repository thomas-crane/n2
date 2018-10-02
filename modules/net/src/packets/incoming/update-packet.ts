/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';
import { GroundTileData } from '../../data/ground-tile-data';
import { ObjectData } from '../../data/object-data';

/**
 * Received when an update even occurs. Some events include
 * + One or more new objects have entered the map (become visible)
 * + One or more objects have left the map (become invisible)
 * + New tiles are visible
 */
export class UpdatePacket implements Packet {

  type = PacketType.UPDATE;
  propagate = true;

  //#region packet-specific members
  /**
   * The new tiles which are visible.
   */
  tiles: GroundTileData[];
  /**
   * The new objects which have entered the map (become visible).
   */
  newObjects: ObjectData[];
  /**
   * The visible objects which have left the map (become invisible).
   */
  drops: number[];
  //#endregion

  constructor() {
    this.tiles = [];
    this.newObjects = [];
    this.drops = [];
  }

  read(buffer: PacketBuffer): void {
    const tilesLen = buffer.readShort();
    this.tiles = new Array<GroundTileData>(tilesLen);
    for (let i = 0; i < tilesLen; i++) {
      const gd = new GroundTileData();
      gd.read(buffer);
      this.tiles[i] = gd;
    }

    const newObjectsLen = buffer.readShort();
    this.newObjects = new Array<ObjectData>(newObjectsLen);
    for (let i = 0; i < newObjectsLen; i++) {
      const od = new ObjectData();
      od.read(buffer);
      this.newObjects[i] = od;
    }

    const dropsLen = buffer.readShort();
    this.drops = new Array<number>(dropsLen);
    for (let i = 0; i < dropsLen; i++) {
      this.drops[i] = buffer.readInt32();
    }
  }

  write(buffer: PacketBuffer): void {
    buffer.writeShort(this.tiles.length);
    for (const tile of this.tiles) {
      tile.write(buffer);
    }
    buffer.writeShort(this.newObjects.length);
    for (const obj of this.newObjects) {
      obj.write(buffer);
    }
    buffer.writeShort(this.drops.length);
    for (const drop of this.drops) {
      buffer.writeInt32(drop);
    }
  }
}
