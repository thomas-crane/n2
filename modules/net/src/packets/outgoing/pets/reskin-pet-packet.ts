/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../../packet-buffer';
import { PacketType } from '../../../packet-type';
import { Packet } from '../../../packet';
import { SlotObjectData } from '../../../data';

/**
 * Sent to make an update to the pet currently following the player.
 */
export class ReskinPetPacket implements Packet {

  type = PacketType.PET_CHANGE_FORM_MSG;
  propagate = true;

  //#region packet-specific members
  /**
   * The instance id of the pet to update.
   */
  instanceId: number;
  /**
   * The pet type that the pet will become after the form change.
   */
  newPetType: number;
  item: SlotObjectData;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.instanceId);
    buffer.writeByte(this.newPetType);
    this.item.write(buffer);
  }

  read(buffer: PacketBuffer): void {
    this.instanceId = buffer.readInt32();
    this.newPetType = buffer.readByte();
    this.item = new SlotObjectData();
    this.item.read(buffer);
  }
}
