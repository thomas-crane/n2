/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to edit an account id list.
 */
export class EditAccountListPacket implements Packet {

  type = PacketType.EDITACCOUNTLIST;
  propagate = true;

  //#region packet-specific members
  /**
   * The id of the account id list being edited.
   */
  accountListId: number;
  /**
   * Whether the edit is to add to the list or remove from it.
   */
  add: boolean;
  /**
   * The object id of the player to add to the list.
   */
  objectId: number;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.accountListId);
    buffer.writeBoolean(this.add);
    buffer.writeInt32(this.objectId);
  }

  read(buffer: PacketBuffer): void {
    this.accountListId = buffer.readInt32();
    this.add = buffer.readBoolean();
    this.objectId = buffer.readInt32();
  }
}
