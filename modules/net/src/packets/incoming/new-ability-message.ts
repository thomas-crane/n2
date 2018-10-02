/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Received when a new ability has been unlocked by the player.
 */
export class NewAbilityMessage implements Packet {

  type = PacketType.NEW_ABILITY;
  propagate = true;

  //#region packet-specific members
  /**
   * The type of ability which has been unlocked.
   */
  abilityType: number;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.abilityType = buffer.readInt32();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.abilityType);
  }
}
