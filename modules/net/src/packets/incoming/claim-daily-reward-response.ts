/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Received in response to a `ClaimDailyRewardMessage`.
 */
export class ClaimDailyRewardResponse implements Packet {

  type = PacketType.LOGIN_REWARD_MSG;
  propagate = true;

  //#region packet-specific members
  /**
   * The item id of the reward received.
   */
  itemId: number;
  /**
   * The number of items received.
   */
  quantity: number;
  /**
   * Unknown.
   */
  gold: number;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.itemId = buffer.readInt32();
    this.quantity = buffer.readInt32();
    this.gold = buffer.readInt32();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.itemId);
    buffer.writeInt32(this.quantity);
    buffer.writeInt32(this.gold);
  }
}
