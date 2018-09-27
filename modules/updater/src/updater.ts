/**
 * @module updater
 */
import * as path from 'path';
import { exec } from 'child_process';

import { Logger, LogLevel, HttpClient } from '@n2/common';
import { Endpoints } from '@n2/common';
import { PacketIdMap, PacketType } from '@n2/net';
import { WriteStream } from 'fs';

/**
 * The path to the `lib/` folder.
 */
const LIB_DIR = path.resolve(__dirname, '..', 'lib');
/**
 * The regex to extract packet information from a `GameServerConnection.as` file.
 */
const PACKET_REGEX = /static const ([A-Z_]+):int = (\d+);/g;
/**
 * The path from a the root of a decompiled client
 * source to the `GameServerConnection.as` file.
 */
const GSC_PATH = path.join(
  'scripts', 'kabam', 'rotmg', 'messaging',
  'impl', 'GameServerConnection.as'
);

/**
 * Information about the local version of the assets.
 */
interface VersionInfo {
  clientVersion: string;
  assetVersion: string;
}

/**
 * A static class used to download the latest game assets and packet ids.
 */
export default class Updater {

  /**
   * Creates a path from the `base` path to the GameServerConnection.as file.
   * @param base The parent dir which contains the decompiled client source.
   */
  static makeGSCPath(base: string): string {
    if (typeof base !== 'string' || !base) {
      return null;
    }
    return path.join(base, GSC_PATH);
  }

  /**
   * Checks if the remote client version matches the local client version.
   * @returns `true` if the `localVersion` does **not** match the remote version,
   * @param localVersion The local version of the client.
   */
  static isClientOutdated(localVersion: string): Promise<boolean> {
    return this.getRemoteClientVersion().then((version) => {
      return localVersion !== version;
    });
  }

  /**
   * Checks if the remote asset version matches the local asset version.
   * @returns `true` if the `localVersion` does **not** match the remote version,
   * @param localVersion The local version of the asset.
   */
  static areAssetsOutdated(localVersion: string): Promise<boolean> {
    return this.getRemoteAssetVersion().then((version) => {
      return localVersion !== version;
    });
  }

  /**
   * Downloads the latest client.swf into a buffer.
   */
  static getClient(version: string, stream?: WriteStream): Promise<Buffer> {
    const downloadUrl = Endpoints.GAME_CLIENT.replace('{{version}}', version);
    return HttpClient.get(downloadUrl, { stream });
  }

  /**
   * Downdloads the latest GroundTypes.json into a buffer.
   */
  static getGroundTypes(stream?: WriteStream): Promise<Buffer> {
    return HttpClient.get(Endpoints.STATIC_DRIPS + '/current/json/GroundTypes.json', { stream });
  }

  /**
   * Downloads the latest Objects.json into a buffer.
   */
  static getObjects(stream?: WriteStream): Promise<Buffer> {
    return HttpClient.get(Endpoints.STATIC_DRIPS + '/current/json/Objects.json', { stream });
  }

  /**
   * Gets the remote client version.
   */
  static getRemoteClientVersion(): Promise<string> {
    return HttpClient.get(Endpoints.VERSION).then((result) => {
      return result.toString();
    });
  }

  /**
   * Gets the remote asset version.
   */
  static getRemoteAssetVersion(): Promise<string> {
    return HttpClient.get(Endpoints.STATIC_DRIPS + '/current/version.txt').then((result) => {
      return result.toString();
    });
  }

  /**
   * Gets the remote version of both the client and the assets.
   */
  static getRemoteVersions(): Promise<VersionInfo> {
    return Promise.all([
      this.getRemoteClientVersion(),
      this.getRemoteAssetVersion()
    ]).then(([clientVersion, assetVersion]) => {
      return { clientVersion, assetVersion };
    });
  }

  /**
   * Unpacks the client. Returns the path
   * which the client was unpacked into.
   * @param swfPath The path to the swf file to unpack. E.g. `C:\\clients\\latest-client.swf`.
   */
  static unpackSwf(swfPath: string): Promise<string> {
    return new Promise((resolve: (str: string) => void, reject: (err: Error) => void) => {
      const pathInfo = path.parse(swfPath);
      Logger.log('Updater', `Unpacking ${pathInfo.base}`, LogLevel.Info);
      const args = [
        '-jar',
        (`"${path.join(LIB_DIR, 'jpexs', 'ffdec.jar')}"`),
        '-selectclass kabam.rotmg.messaging.impl.GameServerConnection',
        '-export script',
        (`"${path.join(pathInfo.dir, 'decompiled')}"`),
        (`"${path.join(pathInfo.dir, pathInfo.base)}"`)
      ];
      exec(`java ${args.join(' ')}`, (error) => {
        if (error) {
          reject(error);
          return;
        }
        Logger.log('Updater', `Unpacked ${pathInfo.base}`, LogLevel.Success);
        resolve(path.join(pathInfo.dir, 'decompiled'));
      });
    });
  }

  /**
   * Extracts the packet information from the given source.
   * @param source The text containing the packet ids to extract.
   */
  static extractPacketInfo(source: string): PacketIdMap {
    if (typeof source !== 'string' || !source) {
      return null;
    }
    const packets: PacketIdMap = {};
    let match = PACKET_REGEX.exec(source);
    while (match != null) {
      packets[+match[2]] = match[1] as PacketType;
      match = PACKET_REGEX.exec(source);
    }
    Logger.log('Updater', 'Extracted packet info.', LogLevel.Success);
    return packets;
  }
}
