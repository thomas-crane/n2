/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to prompt the server to send a `ReconnectPacket` which
 * contains the reconnect information for the Nexus.
 */
export class EscapePacket implements Packet {

  type = PacketType.ESCAPE;
  propagate = true;

  //#region packet-specific members

  //#endregion

  write(buffer: PacketBuffer): void {
    //
  }

  read(buffer: PacketBuffer): void {
    //
  }
}
