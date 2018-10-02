/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';
import { WorldPosData } from '../../data/world-pos-data';
import { SlotObjectData } from '../../data/slot-object-data';

/**
 * Sent to swap the items of two slots.
 */
export class InvSwapPacket implements Packet {

  type = PacketType.INVSWAP;
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
  /**
   * The slot to swap from.
   */
  slotObject1: SlotObjectData;
  /**
   * The slot to swap to.
   */
  slotObject2: SlotObjectData;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.time);
    this.position.write(buffer);
    this.slotObject1.write(buffer);
    this.slotObject2.write(buffer);
  }

  read(buffer: PacketBuffer): void {
    this.time = buffer.readInt32();
    this.position = new WorldPosData();
    this.position.read(buffer);
    this.slotObject1 = new SlotObjectData();
    this.slotObject1.read(buffer);
    this.slotObject2 = new SlotObjectData();
    this.slotObject2.read(buffer);
  }
}
