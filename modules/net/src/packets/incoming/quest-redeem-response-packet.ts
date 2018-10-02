/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * > Unknown.
 */
export class QuestRedeemResponsePacket implements Packet {

  type = PacketType.QUEST_REDEEM_RESPONSE;
  propagate = true;

  //#region packet-specific members
  /**
   * > Unknown.
   */
  ok: boolean;
  /**
   * > Unknown.
   */
  message: string;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.ok = buffer.readBoolean();
    this.message = buffer.readString();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeBoolean(this.ok);
    buffer.writeString(this.message);
  }
}
