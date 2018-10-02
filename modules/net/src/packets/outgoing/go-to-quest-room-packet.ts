/**
 * @module net/packets/outgoing
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Sent to prompt the server to send a `ReconnectPacket` which
 * contains the reconnect information for the Quest Room.
 */
export class GoToQuestRoomPacket implements Packet {

  type = PacketType.QUEST_ROOM_MSG;
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
