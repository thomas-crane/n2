/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to acknowledge an `UpdatePacket`.
 */
export class UpdateAckPacket implements Packet {

  type = PacketType.UPDATEACK;
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
