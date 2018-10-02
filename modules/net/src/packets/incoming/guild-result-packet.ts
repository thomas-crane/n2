/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * > Unknown.
 */
export class GuildResultPacket implements Packet {

  type = PacketType.GUILDRESULT;
  propagate = true;

  //#region packet-specific members
  /**
   * > Unknown.
   */
  success: boolean;
  /**
   * > Unknown.
   */
  lineBuilderJSON: string;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.success = buffer.readBoolean();
    this.lineBuilderJSON = buffer.readString();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeBoolean(this.success);
    buffer.writeString(this.lineBuilderJSON);
  }
}
