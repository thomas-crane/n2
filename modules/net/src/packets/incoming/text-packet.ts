/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Received when a chat message is sent by another player or NPC.
 */
export class TextPacket implements Packet {

  type = PacketType.TEXT;
  propagate = true;

  //#region packet-specific members
  /**
   * The sender of the message.
   */
  name: string;
  /**
   * The object id of the sender.
   */
  objectId: number;
  /**
   * The number of stars of the sender.
   */
  numStars: number;
  /**
   * The length of time to display the chat bubble for.
   */
  bubbleTime: number;
  /**
   * The recipient of the message. This is only used if the
   * message is a private message.
   */
  recipient: string;
  /**
   * The content of the message.
   */
  text: string;
  /**
   * > Unknown.
   */
  cleanText: string;
  /**
   * Whether or not the sender of the message is a supporter.
   */
  isSupporter: boolean;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.name = buffer.readString();
    this.objectId = buffer.readInt32();
    this.numStars = buffer.readInt32();
    this.bubbleTime = buffer.readUnsignedByte();
    this.recipient = buffer.readString();
    this.text = buffer.readString();
    this.cleanText = buffer.readString();
    this.isSupporter = buffer.readBoolean();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeString(this.name);
    buffer.writeInt32(this.objectId);
    buffer.writeInt32(this.numStars);
    buffer.writeUnsignedByte(this.bubbleTime);
    buffer.writeString(this.text);
    buffer.writeString(this.cleanText);
    buffer.writeBoolean(this.isSupporter);
  }
}
