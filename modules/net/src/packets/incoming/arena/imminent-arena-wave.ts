/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../../packet-buffer';
import { PacketType } from '../../../packet-type';
import { Packet } from '../../../packet';

/**
 * Received when a new arena wave is about to begin.
 */
export class ImminentArenaWavePacket implements Packet {

  type = PacketType.IMMINENT_ARENA_WAVE;
  propagate = true;

  //#region packet-specific members
  /**
   * The length of time the player has been in the arena for.
   */
  currentRuntime: number;
  //#endregion

  read(buffer: PacketBuffer): void {
    this.currentRuntime = buffer.readInt32();
  }

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.currentRuntime);
  }
}
