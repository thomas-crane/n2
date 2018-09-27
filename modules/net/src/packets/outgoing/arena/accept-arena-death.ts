/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../../packet-buffer';
import { PacketType } from '../../../packet-type';
import { OutgoingPacket } from '../../../packet';

/**
 * Sent to accept a death in the arena.
 */
export class AcceptArenaDeathPacket implements OutgoingPacket {

  type = PacketType.ACCEPT_ARENA_DEATH;

  //#region packet-specific members

  //#endregion

  write(buffer: PacketBuffer): void {
    //
  }
}
