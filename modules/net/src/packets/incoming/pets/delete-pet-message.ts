/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../../packet-buffer';
import { PacketType } from '../../../packet-type';
import { Packet } from '../../../packet';

/**
 * Received to notify the player that a pet has been deleted.
 */
export class DeletePetMessage implements Packet {

  type = PacketType.DELETE_PET;
  propagate = true;

  //#region packet-specific members
  /**
   * The id of the pet which has been deleted.
   */
  petId: number;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.petId = buffer.readInt32();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.petId);
  }
}
