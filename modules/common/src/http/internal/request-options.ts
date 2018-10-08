import { Writable } from 'stream';

export interface RequestOptions {
  query?: { [id: string]: any };
  stream?: Writable;
}
