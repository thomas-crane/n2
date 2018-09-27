/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../../packet-buffer';
import { PacketType } from '../../../packet-type';
import { IncomingPacket } from '../../../packet';

/**
 * Received to notify the player of a new pet.
 */
export class ActivePetPacket implements IncomingPacket {

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
}
