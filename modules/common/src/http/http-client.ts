/**
 * @module common/http
 */
import * as url from 'url';
import * as qs from 'querystring';
import * as zlib from 'zlib';
import { Http } from './internal/http';
import { Https } from './internal/https';
import { IncomingMessage } from 'http';
import { Writable } from 'stream';

/**
 * The HTTP headers to include in each request.
 */
export const REQUEST_HEADERS = {
  'Cache-Control': 'max-age=0',
  // tslint:disable-next-line:max-line-length
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate',
  'Connection': 'keep-alive'
};

/**
 * A static helper class used to provide an interface for Promise based web requests.
 */
export class HttpClient {
  /**
   * Makes a GET request to the specified path.
   * @param path The path to make the GET request to.
   * @param options The options to use while making the request.
   */
  static get(path: string, options: RequestOptions = { query: {} }): Promise<Buffer> {
    const endpoint = url.parse(path);
    if (!/https?:/.test(endpoint.protocol)) {
      return Promise.reject(new Error(`Unsupported protocol: "${endpoint.protocol}"`));
    }
    let queryString = qs.stringify(options.query);
    if (queryString) {
      queryString = `?${queryString}`;
    }
    if (endpoint.protocol === 'http:') {
      return Http.get(endpoint.hostname, endpoint.path + queryString, options.stream);
    } else {
      return Https.get(endpoint.hostname, endpoint.path + queryString, options.stream);
    }
  }

  /**
   * Unzips a gzipped HTTP response.
   * @param zipped The gzipped response to unzip.
   */
  static unzip(zipped: IncomingMessage, stream?: Writable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const unzip = zlib.createGunzip();
      zipped.pipe(unzip);
      const data: Buffer[] = [];
      unzip.on('data', (chunk) => {
        data.push(chunk as Buffer);
      });
      unzip.once('end', () => {
        unzip.removeAllListeners('data');
        unzip.removeAllListeners('error');
        if (stream !== undefined) {
          stream.end(Buffer.concat(data), resolve);
        } else {
          resolve(Buffer.concat(data));
        }
      });
      unzip.once('error', (error) => {
        unzip.removeAllListeners('data');
        unzip.removeAllListeners('end');
        reject(error);
      });
    });
  }

  /**
   * Makes a POST request to the specified path and passes the provided parameters.
   * @param path The path to make the POST request to.
   * @param params The POST parameters to include.
   */
  static post(path: string, params?: { [id: string]: any }, stream?: Writable): Promise<Buffer> {
    const endpoint = url.parse(path);
    if (!/https?:/.test(endpoint.protocol)) {
      return Promise.reject(new Error(`Unsupported protocol: "${endpoint.protocol}"`));
    }
    if (endpoint.protocol === 'http:') {
      return Http.post(endpoint, params, stream);
    } else {
      return Https.post(endpoint, params, stream);
    }
  }
}

export interface RequestOptions {
  query?: { [id: string]: any };
  stream?: Writable;
}
