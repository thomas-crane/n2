/**
 * @module common/http
 */
import * as url from 'url';
import * as qs from 'querystring';
import * as zlib from 'zlib';
import { Http } from './internal/http';
import { Https } from './internal/https';
import { IncomingMessage } from 'http';
import { Writable, Readable } from 'stream';
import { RequestOptions } from './internal/request-options';

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
    if (typeof path !== 'string') {
      return Promise.reject(new TypeError(`Parameter "path" should be a string, not ${typeof path}`));
    }
    let queryString = qs.stringify(options.query);
    if (queryString) {
      queryString = `?${queryString}`;
    }

    const endpoint = url.parse(path + queryString);
    let incomingMsg: Promise<IncomingMessage>;
    switch (endpoint.protocol) {
      case 'http:':
        incomingMsg = Http.get(endpoint);
        break;
      case 'https:':
        incomingMsg = Https.get(endpoint);
        break;
      default: return Promise.reject(new Error(`Unsupported protocol "${endpoint.protocol}"`));
    }
    return incomingMsg.then((msg) => {
      return this.handleResponse(msg, options.stream);
    });
  }

  /**
   * Makes a POST request to the specified path and passes the provided parameters.
   * @param path The path to make the POST request to.
   * @param params The POST parameters to include.
   */
  static post(path: string, params?: { [id: string]: any }, stream?: Writable): Promise<Buffer> {
    if (typeof path !== 'string') {
      return Promise.reject(new TypeError(`Parameter "path" should be a string, not ${typeof path}`));
    }
    const endpoint = url.parse(path);
    const postData = qs.stringify(params);

    let incomingMsg: Promise<IncomingMessage>;
    switch (endpoint.protocol) {
      case 'http:':
        incomingMsg = Http.post(endpoint, postData);
        break;
      case 'https:':
        incomingMsg = Https.post(endpoint, postData);
        break;
      default: return Promise.reject(new Error(`Unsupported protocol "${endpoint.protocol}"`));
    }
    return incomingMsg.then((msg) => {
      return this.handleResponse(msg, stream);
    });
  }

  private static handleResponse(msg: IncomingMessage, writeStream?: Writable): Promise<Buffer> {
    return new Promise((resolve: (buffer: Buffer) => void, reject) => {
      let stream: Readable = msg;
      if (msg.headers['content-encoding'] === 'gzip') {
        const gunzip = zlib.createGunzip();
        stream = msg.pipe(gunzip);
      }
      if (writeStream) {
        stream.pipe(writeStream).once('close', resolve).once('error', reject);
      } else {
        let data: any = [];
        stream.on('data', (chunk) => {
          data.push(chunk);
        });
        stream.once('end', () => {
          data = Buffer.concat(data);
          resolve(data);
        });
        stream.once('error', reject);
      }
    });
  }
}
