/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';
import { SlotObjectData } from '../../data/slot-object-data';
import { WorldPosData } from '../../data/world-pos-data';

/**
 * Sent to use an item, such as an ability or consumable.
 */
export class UseItemPacket implements Packet {

  type = PacketType.USEITEM;
  propagate = true;

  //#region packet-specific members
  /**
   * The current client time.
   */
  time: number;
  /**
   * The slot of the item being used.
   */
  slotObject: SlotObjectData;
  /**
   * The position at which the item was used.
   */
  itemUsePos: WorldPosData;
  /**
   * The type of item usage.
   */
  useType: number;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.time);
    this.slotObject.write(buffer);
    this.itemUsePos.write(buffer);
    buffer.writeByte(this.useType);
  }

  read(buffer: PacketBuffer): void {
    this.time = buffer.readInt32();
    this.slotObject = new SlotObjectData();
    this.slotObject.read(buffer);
    this.itemUsePos = new WorldPosData();
    this.itemUsePos.read(buffer);
    this.useType = buffer.readByte();
  }
}
