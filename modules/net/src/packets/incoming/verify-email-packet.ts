/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Received to prompt the player to verify their email.
 */
export class VerifyEmailPacket implements Packet {

  type = PacketType.VERIFY_EMAIL;
  propagate = true;

  //#region packet-specific members

  //#endregion

  read(buffer: PacketBuffer): void {
    //
  }

  write(buffer: PacketBuffer): void {
    //
  }
}
