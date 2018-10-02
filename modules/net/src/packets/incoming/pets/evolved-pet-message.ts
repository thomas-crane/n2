/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../../packet-buffer';
import { PacketType } from '../../../packet-type';
import { Packet } from '../../../packet';

/**
 * Received to give the player information about a newly evolved pet.
 */
export class EvolvedPetMessage implements Packet {

  type = PacketType.EVOLVE_PET;
  propagate = true;

  //#region packet-specific members
  /**
   * The id of the pet which has evolved.
   */
  petId: number;
  /**
   * The current skin id of the pet.
   */
  initialSkin: number;
  /**
   * The skin id of the pet after its evolution.
   */
  finalSkin: number;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.petId = buffer.readInt32();
    this.initialSkin = buffer.readInt32();
    this.finalSkin = buffer.readInt32();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.petId);
    buffer.writeInt32(this.initialSkin);
    buffer.writeInt32(this.finalSkin);
  }
}
