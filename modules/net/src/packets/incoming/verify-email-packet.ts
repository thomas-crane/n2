/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { IncomingPacket } from '../../packet';

/**
 * Received to prompt the player to verify their email.
 */
export class VerifyEmailPacket implements IncomingPacket {

  type = PacketType.VERIFY_EMAIL;
  propagate = true;

  //#region packet-specific members

  //#endregion

  read(buffer: PacketBuffer): void {
    //
  }
}
