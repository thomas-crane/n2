/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../../packet-buffer';
import { PacketType } from '../../../packet-type';
import { Packet } from '../../../packet';

/**
 * Sent to accept a death in the arena.
 */
export class AcceptArenaDeathPacket implements Packet {

  type = PacketType.ACCEPT_ARENA_DEATH;
  propagate = true;

  //#region packet-specific members

  //#endregion

  write(buffer: PacketBuffer): void {
    //
  }

  read(buffer: PacketBuffer): void {
    //
  }
}
