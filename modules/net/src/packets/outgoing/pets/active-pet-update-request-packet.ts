/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../../packet-buffer';
import { PacketType } from '../../../packet-type';
import { Packet } from '../../../packet';

/**
 * Sent to make an update to the pet currently following the player.
 */
export class ActivePetUpdateRequestPacket implements Packet {

  type = PacketType.ACTIVE_PET_UPDATE_REQUEST;
  propagate = true;

  //#region packet-specific members
  /**
   * The type of update to perform.
   */
  commandType: number;
  /**
   * The instance id of the pet to update.
   */
  instanceId: number;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeByte(this.commandType);
    buffer.writeInt32(this.instanceId);
  }

  read(buffer: PacketBuffer): void {
    this.commandType = buffer.readByte();
    this.instanceId = buffer.readInt32();
  }
}
