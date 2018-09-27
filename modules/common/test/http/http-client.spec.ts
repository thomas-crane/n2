import { expect } from 'chai';
import 'mocha';

import { HttpClient } from '../../src';
import * as mockServer from '../../../../lib/test-api';
import { MockStream } from '../../../../lib/mock-stream';

describe('HttpClient', () => {
  describe('#get()', () => {
    beforeEach((done) => {
      mockServer.init(false, done);
    });
    afterEach((done) => {
      mockServer.destroy(done);
    });
    it('should throw a TypeError for invalid inputs.', () => {
      expect(() => HttpClient.get(123 as any)).to.throw(TypeError);
      expect(() => HttpClient.get(['hello', 'world'] as any)).to.throw(TypeError);
      expect(() => HttpClient.get(null)).to.throw(TypeError);
    });
    it('should return a buffer if no write stream is passed.', () => {
      return HttpClient.get('http://localhost').then((buffer) => {
        expect(Buffer.isBuffer(buffer)).to.equal(true);
      });
    });
    it('should include default request headers.', () => {
      return HttpClient.get('http://localhost').then((buffer) => {
        const headers = JSON.parse(buffer.toString()).headers;
        expect(headers).to.haveOwnProperty('cache-control');
        expect(headers).to.haveOwnProperty('user-agent');
        expect(headers).to.haveOwnProperty('accept');
        expect(headers).to.haveOwnProperty('accept-encoding');
        expect(headers).to.haveOwnProperty('connection');
      });
    });
    it('should write to the provided write stream.', () => {
      const stream = new MockStream();
      return HttpClient.get('http://localhost', { stream }).then((buffer) => {
        expect(buffer).to.equal(undefined, 'Buffer is not undefined.');
      });
    });
    it('should stringify query parameters.', () => {
      return HttpClient.get('http://localhost', {
        query: {
          test: 'param',
          test2: 'param2'
        }
      }).then((buffer) => {
        const str = buffer.toString();
        expect(str).to.contain('?test=param&test2=param2', 'Query parameters not included.');
      });
    });
  });
  describe('#post()', () => {
    beforeEach((done) => {
      mockServer.init(false, done);
    });
    afterEach((done) => {
      mockServer.destroy(done);
    });
    it('should throw a TypeError for invalid inputs.', () => {
      expect(() => HttpClient.post(123 as any)).to.throw(TypeError);
      expect(() => HttpClient.post(['hello', 'world'] as any)).to.throw(TypeError);
      expect(() => HttpClient.post(null)).to.throw(TypeError);
    });
    it('should return a buffer if no write stream is passed.', () => {
      return HttpClient.post('http://localhost', { test: 'param' }).then((buffer) => {
        expect(Buffer.isBuffer(buffer)).to.equal(true);
      });
    });
    it('should include default request headers.', () => {
      return HttpClient.post('http://localhost', { test: 'param' }).then((buffer) => {
        const headers = JSON.parse(buffer.toString()).headers;
        expect(headers).to.haveOwnProperty('content-type');
        expect(headers).to.haveOwnProperty('content-length');
        expect(headers).to.haveOwnProperty('cache-control');
        expect(headers).to.haveOwnProperty('user-agent');
        expect(headers).to.haveOwnProperty('accept');
        expect(headers).to.haveOwnProperty('accept-encoding');
        expect(headers).to.haveOwnProperty('connection');
      });
    });
    it('should write to the provided write stream.', () => {
      const stream = new MockStream();
      return HttpClient.post('http://localhost', { test: 'param' }, stream).then((buffer) => {
        expect(buffer).to.equal(undefined, 'Buffer is not undefined.');
      });
    });
    it('should write the post parameters to the body.', () => {
      return HttpClient.post('http://localhost', {
        test: 'param',
        test2: 'param2'
      }).then((buffer) => {
        const body = JSON.parse(buffer.toString()).body;
        expect(body).to.equal('test=param&test2=param2', 'Query parameters not included.');
      });
    });
  });
  describe('#unzip()', () => {
    beforeEach((done) => {
      mockServer.init(true, done);
    });
    afterEach((done) => {
      mockServer.destroy(done);
    });
    it('should unzip gzipped responses for get requests.', () => {
      return HttpClient.get('http://localhost', {
        query: {
          test: 'param'
        }
      }).then((buffer) => {
        const str = buffer.toString();
        expect(str).to.contain('?test=param', 'Gzipped get request response not unzipped.');
      });
    });
    it('should unzip gzipped responses for post requests.', () => {
      return HttpClient.post('http://localhost', { test: 'param' }).then((buffer) => {
        const body = JSON.parse(buffer.toString()).body;
        expect(body).to.equal('test=param', 'Gzipped post request response not unzipped.');
      });
    });
  });
});
