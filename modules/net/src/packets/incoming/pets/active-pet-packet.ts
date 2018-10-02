/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../../packet-buffer';
import { PacketType } from '../../../packet-type';
import { Packet } from '../../../packet';

/**
 * Received to notify the player of a new pet.
 */
export class ActivePetPacket implements Packet {

  type = PacketType.ACTIVEPETUPDATE;
  propagate = true;

  //#region packet-specific members
  /**
   * The instance id of the active pet.
   */
  instanceId: number;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.instanceId = buffer.readInt32();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.instanceId);
  }
}
