/**
 * @module common/http
 */
import * as https from 'https';
import * as url from 'url';
import * as qs from 'querystring';
import { REQUEST_HEADERS, HttpClient } from '../http-client';
import { Writable } from 'stream';

/**
 * A class used internally by the `HttpClient` to work with https urls.
 *
 * @see HttpClient The `HttpClient` class should be used instead of this one.
 */
export class Https {
  /**
   * This method is used internally by the `HttpClient` class.
   *
   * **It is not recommended to use this method directly. Use `HttpClient.get` instead.**
   */
  static get(path: string, query: string, stream?: Writable): Promise<Buffer> {
    const opts: https.RequestOptions = {
      hostname: path,
      path: query,
      method: 'GET',
      headers: REQUEST_HEADERS
    };
    return new Promise((resolve, reject) => {
      const req = https.get(opts, (response) => {
        if (response.headers['content-encoding'] === 'gzip') {
          HttpClient.unzip(response, stream).then(resolve, reject);
        } else {
          const data: Buffer[] = [];
          response.on('data', (chunk) => {
            data.push(chunk as Buffer);
          });
          response.once('end', () => {
            response.removeAllListeners('data');
            response.removeAllListeners('error');
            if (stream !== undefined) {
              stream.end(Buffer.concat(data), resolve);
            } else {
              resolve(Buffer.concat(data));
            }
          });
          response.once('error', (error) => {
            response.removeAllListeners('data');
            response.removeAllListeners('end');
            reject(error);
          });
        }
      });
      req.end();
    });
  }

  /**
   * This method is used internally by the `HttpClient` class.
   *
   * **It is not recommended to use this method directly. Use `HttpClient.post` instead.**
   */
  static post(endpoint: url.Url, params: { [id: string]: any }, stream?: Writable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const postData = qs.stringify(params);
      const options = {
        host: endpoint.host,
        path: endpoint.path,
        method: 'POST',
        headers: Object.assign({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }, REQUEST_HEADERS)
      };
      const req = https.request(options, (response) => {
        if (response.headers['content-encoding'] === 'gzip') {
          HttpClient.unzip(response).then(resolve, reject);
        } else {
          const data: Buffer[] = [];
          response.on('data', (chunk) => {
            data.push(chunk as Buffer);
          });
          response.once('end', () => {
            response.removeAllListeners('data');
            response.removeAllListeners('error');
            if (stream !== undefined) {
              stream.end(Buffer.concat(data), resolve);
            } else {
              resolve(Buffer.concat(data));
            }
          });
          response.once('error', (error) => {
            response.removeAllListeners('data');
            response.removeAllListeners('end');
            reject(error);
          });
        }
      });
      req.write(postData);
      req.end();
    });
  }
}
