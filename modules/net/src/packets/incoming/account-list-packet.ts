/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Received to provide lists of accounts ids which are
 * those of players who have been locked, ignored, etc.
 */
export class AccountListPacket implements Packet {

  type = PacketType.ACCOUNTLIST;
  propagate = true;

  //#region packet-specific members
  /**
   * The id of the account id list.
   */
  accountListId: number;
  /**
   * The account ids included in the list.
   */
  accountIds: string[];
  /**
   * > Unknown.
   */
  lockAction: number;
  //#endregion

  constructor() {
    this.accountIds = [];
  }

  read(buffer: PacketBuffer): void {
    this.accountListId = buffer.readInt32();
    const accountIdsLen = buffer.readShort();
    this.accountIds = new Array<string>(accountIdsLen);
    for (let i = 0; i < accountIdsLen; i++) {
      this.accountIds[i] = buffer.readString();
    }
    this.lockAction = buffer.readInt32();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.accountListId);
    buffer.writeShort(this.accountIds.length);
    for (const id of this.accountIds) {
      buffer.writeString(id);
    }
    buffer.writeInt32(this.lockAction);
  }
}
