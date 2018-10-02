/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent when the client sends a chat message.
 */
export class PlayerTextPacket implements Packet {

  type = PacketType.PLAYERTEXT;
  propagate = true;

  //#region packet-specific members
  /**
   * The message to send.
   */
  text: string;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeString(this.text);
  }

  read(buffer: PacketBuffer): void {
    this.text = buffer.readString();
  }
}
