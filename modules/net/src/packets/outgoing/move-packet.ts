/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';
import { WorldPosData } from '../../data/world-pos-data';
import { MoveRecord } from '../../data/move-record';

/**
 * Sent to acknowledge a `NewTickPacket`, and to notify the
 * server of the client's current position and time.
 */
export class MovePacket implements Packet {

  type = PacketType.MOVE;
  propagate = true;

  //#region packet-specific members
  /**
   * The tick id of the `NewTickPacket` which this is acknowledging.
   */
  tickId: number;
  /**
   * The current client time.
   */
  time: number;
  /**
   * The current client position.
   */
  newPosition: WorldPosData;
  /**
   * The move records of the client.
   *
   * This property can be an empty array.
   */
  records: MoveRecord[];
  //#endregion

  constructor() {
    this.records = [];
  }

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.tickId);
    buffer.writeInt32(this.time);
    this.newPosition.write(buffer);
    buffer.writeShort(this.records.length);
    for (const record of this.records) {
      record.write(buffer);
    }
  }

  read(buffer: PacketBuffer): void {
    this.tickId = buffer.readInt32();
    this.time = buffer.readInt32();
    this.newPosition = new WorldPosData();
    this.newPosition.read(buffer);
    this.records = new Array(buffer.readShort());
    for (let i = 0; i < this.records.length; i++) {
      this.records[i] = new MoveRecord();
      this.records[i].read(buffer);
    }
  }
}
