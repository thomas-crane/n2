/**
 * @module common/http
 */
import { RequestOptions, request, get } from 'https';
import { Url } from 'url';
import { REQUEST_HEADERS } from '../http-client';
import { IncomingMessage } from 'http';

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
  static get(endpoint: Url): Promise<IncomingMessage> {
    const opts: RequestOptions = {
      host: endpoint.host,
      path: endpoint.path,
      headers: REQUEST_HEADERS
    };
    return new Promise((resolve, reject) => {
      get(opts, resolve).once('error', reject);
    });
  }

  /**
   * This method is used internally by the `HttpClient` class.
   *
   * **It is not recommended to use this method directly. Use `HttpClient.post` instead.**
   */
  static post(endpoint: Url, postData: string): Promise<IncomingMessage> {
    const opts: RequestOptions = {
      host: endpoint.host,
      path: endpoint.path,
      method: 'POST',
      headers: Object.assign({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }, REQUEST_HEADERS)
    };
    return new Promise((resolve, reject) => {
      request(opts, resolve).once('error', reject).end(postData);
    });
  }
}
