/**
 * @module net
 */
import { PacketBuffer } from './packet-buffer';
import { PacketType } from './packet-type';

/**
 * A packet which can be both received from the server and sent to the server.
 */
export interface DataPacket {
  /**
   * Writes the packet to the `buffer` according to the packet's structure.
   * @param buffer The buffer to write to.
   */
  write(buffer: PacketBuffer): void;
  /**
   * Reads data from the `buffer` according to the structure of the packet.
   * @param buffer The buffer to read from.
   */
  read(buffer: PacketBuffer): void;
}

export interface Packet extends DataPacket {
  /**
   * The type of packet.
   */
  type: PacketType;
  /**
   * Whether or not the packet should keep invoking packet hooks.
   *
   * If this is set to `false` by a packet hook, then that packet hook will
   * be the last one which receives the packet. The client's packet hooks are
   * always the last ones to be called, so if this is set to `false` the packet
   * will not reach the client.
   */
  propagate: boolean;
}
