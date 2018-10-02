/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Received to prompt the player to enter their password.
 */
export class PasswordPromptPacket implements Packet {

  type = PacketType.PASSWORD_PROMPT;
  propagate = true;

  //#region packet-specific members
  /**
   * > Unknown.
   */
  cleanPasswordStatus: number;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.cleanPasswordStatus = buffer.readInt32();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.cleanPasswordStatus);
  }
}
