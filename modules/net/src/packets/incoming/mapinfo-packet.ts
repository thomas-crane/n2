/**
 * @module net/packets/incoming
 */
import { PacketBuffer } from '../../packet-buffer';
import { PacketType } from '../../packet-type';
import { Packet } from '../../packet';

/**
 * Received in response to the `HelloPacket`.
 */
export class MapInfoPacket implements Packet {

  type = PacketType.MAPINFO;
  propagate = true;

  //#region packet-specific members
  /**
   * The width of the map.
   */
  width: number;
  /**
   * The height of the map.
   */
  height: number;
  /**
   * The name of the map.
   */
  name: string;
  /**
   * > Unknown.
   */
  displayName: string;
  /**
   * The difficulty rating of the map.
   */
  difficulty: number;
  /**
   * The seed value for the client's PRNG.
   */
  fp: number;
  /**
   * > Unkown.
   */
  background: number;
  /**
   * Whether or not players can teleport in the map.
   */
  allowPlayerTeleport: boolean;
  /**
   * > Unkown.
   */
  showDisplays: boolean;
  /**
   * > Unkown.
   */
  clientXML: string[];
  /**
   * > Unkown.
   */
  extraXML: string[];
  //#endregion

  constructor() {
    this.clientXML = [];
    this.extraXML = [];
  }

  read(buffer: PacketBuffer): void {
    this.width = buffer.readInt32();
    this.height = buffer.readInt32();
    this.name = buffer.readString();
    this.displayName = buffer.readString();
    this.fp = buffer.readUInt32();
    this.background = buffer.readInt32();
    this.difficulty = buffer.readInt32();
    this.allowPlayerTeleport = buffer.readBoolean();
    this.showDisplays = buffer.readBoolean();
    this.clientXML = new Array<string>(buffer.readShort());
    for (let i = 0; i < this.clientXML.length; i++) {
      this.clientXML[i] = buffer.readStringUTF32();
    }
    this.extraXML = new Array<string>(buffer.readShort());
    for (let i = 0; i < this.extraXML.length; i++) {
      this.extraXML[i] = buffer.readStringUTF32();
    }
  }

  write(buffer: PacketBuffer): void {
    buffer.writeInt32(this.width);
    buffer.writeInt32(this.height);
    buffer.writeString(this.name);
    buffer.writeString(this.displayName);
    buffer.writeInt32(this.fp);
    buffer.writeInt32(this.background);
    buffer.writeInt32(this.difficulty);
    buffer.writeBoolean(this.allowPlayerTeleport);
    buffer.writeBoolean(this.showDisplays);
    buffer.writeShort(this.clientXML.length);
    for (const xml of this.clientXML) {
      buffer.writeStringUTF32(xml);
    }
    buffer.writeShort(this.extraXML.length);
    for (const xml of this.extraXML) {
      buffer.writeStringUTF32(xml);
    }
  }
}
