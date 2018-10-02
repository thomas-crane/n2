/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to acknowledge the `PingPacket.`
 */
export class PongPacket implements Packet {

  type = PacketType.PONG;
  propagate = true;

  //#region packet-specific members
  /**
   * The serial value received in the `PingPacket` which this acknowledges.
   */
  serial: number;
  /**
   * The current client time.
   */
  time: number;
  //#endregion

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.serial);
    buffer.writeInt32(this.time);
  }

  read(buffer: PacketBuffer): void {
    this.serial = buffer.readInt32();
    this.time = buffer.readInt32();
  }
}
