/**
 * @module common/http
 */
import { Writable } from 'stream';

/**
 * The options which can be used when making a request with the `HttpClient`.
 */
export interface RequestOptions {
  query?: { [id: string]: any };
  stream?: Writable;
}
