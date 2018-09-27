/**
 * @module core/parsers
 */
import { Server } from '../models';

// tslint:disable-next-line:max-line-length
const SERVER_REGEX = /<Name>([A-Za-z0-9]+)<\/Name><DNS>([0-9.]+)<\/DNS><Lat>([0-9.-]+)<\/Lat><Long>([0-9.-]+)<\/Long><Usage>([0-9.]+)<\/Usage>/g;

/**
 * A parser for interpreting the XML server list data.
 */
export class ServerParser {
  /**
   * Parses the `xml` into an array of `Server`s. If no
   * servers are found then an empty array will be returned.
   * @param xml The xml to parse.
   */
  static parse(xml: string): Server[] {
    if (typeof xml !== 'string') {
      throw new TypeError(`Parameter "xml" must be a string, not ${typeof xml}`);
    }
    const servers: Server[] = [];
    let match = SERVER_REGEX.exec(xml);
    while (match) {
      servers.push({
        name: match[1],
        ip: match[2],
        location: {
          lat: +match[3],
          long: +match[4]
        },
        usage: +match[5]
      });
      match = SERVER_REGEX.exec(xml);
    }
    return servers;
  }
}
