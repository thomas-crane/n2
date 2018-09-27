import { expect } from 'chai';
import 'mocha';

import { ServerParser } from '../../src';

// tslint:disable-next-line:max-line-length
const SAMPLE_DATA = '<Server><Name>EUEast</Name><DNS>18.195.167.79</DNS><Lat>54.69</Lat><Long>25.28</Long><Usage>0.00</Usage></Server><Server><Name>Australia</Name><DNS>54.252.165.65</DNS><Lat>-33.87</Lat><Long>151.21</Long><Usage>0.00</Usage></Server><Server><Name>EUNorth</Name><DNS>54.93.78.148</DNS><Lat>59.33</Lat><Long>18.06</Long><Usage>0.00</Usage></Server>';

describe('ServerParser', () => {
  describe('#parse()', () => {
    it('should return an array of servers for valid inputs.', () => {
      const servers = ServerParser.parse(SAMPLE_DATA);
      expect(servers.length).to.equal(3, 'Incorrect number of servers.');
      expect(servers[0]).to.deep.equal({
        name: 'EUEast',
        ip: '18.195.167.79',
        location: {
          lat: 54.69,
          long: 25.28
        },
        usage: 0
      });
      expect(servers[1]).to.deep.equal({
        name: 'Australia',
        ip: '54.252.165.65',
        location: {
          lat: -33.87,
          long: 151.21
        },
        usage: 0
      });
      expect(servers[2]).to.deep.equal({
        name: 'EUNorth',
        ip: '54.93.78.148',
        location: {
          lat: 59.33,
          long: 18.06
        },
        usage: 0
      });
    });
    it('should return an empty array for valid inputs with no servers.', () => {
      const servers = ServerParser.parse('Hello, World!');
      expect(servers.length).to.equal(0, 'Incorrect length for no server input.');
    });
    it('should throw a TypeError for invalid inputs.', () => {
      expect(() => ServerParser.parse(431 as any)).to.throw(TypeError);
      expect(() => ServerParser.parse(['Hello', 'World'] as any)).to.throw(TypeError);
      expect(() => ServerParser.parse(null)).to.throw(TypeError);
    });
  });
});
