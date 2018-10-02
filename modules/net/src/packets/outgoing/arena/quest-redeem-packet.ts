/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../../packet-buffer';
import { PacketType } from '../../../packet-type';
import { SlotObjectData } from '../../../data/slot-object-data';
import { Packet } from '../../../packet';

/**
 * > Unknown.
 */
export class QuestRedeemPacket implements Packet {

  type = PacketType.QUEST_REDEEM;
  propagate = true;

  //#region packet-specific members
  /**
   * > Unknown.
   */
  questId: string;
  /**
   * > Unknown.
   */
  slots: SlotObjectData[];
  //#endregion

  constructor() {
    this.slots = [];
  }

  write(buffer: PacketBuffer): void {
    buffer.writeString(this.questId);
    buffer.writeShort(this.slots.length);
    for (const slot of this.slots) {
      slot.write(buffer);
    }
  }

  read(buffer: PacketBuffer): void {
    this.questId = buffer.readString();
    const slotsLen = buffer.readShort();
    this.slots = new Array(slotsLen);
    for (let i = 0; i < slotsLen; i++) {
      this.slots[i] = new SlotObjectData();
      this.slots[i].read(buffer);
    }
  }
}
