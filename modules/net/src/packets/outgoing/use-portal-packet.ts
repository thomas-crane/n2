/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to prompt the server to send a `ReconnectPacket` which
 * contains the reconnect information for the used portal.
 */
export class UsePortalPacket implements Packet {

  type = PacketType.USEPORTAL;
  propagate = true;

  //#region packet-specific members
  /**
   * The object id of the portal to enter.
   */
  objectId: number;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.objectId);
  }

  read(buffer: PacketBuffer): void {
    this.objectId = buffer.readInt32();
  }
}
