import { expect } from 'chai';
import 'mocha';
import * as path from 'path';

import Updater from '../src';

describe('Updater', () => {
  describe('#makeGSCPath()', () => {
    it('should return the correct path for valid inputs.', () => {
      const base = 'test';
      const expected = path.join(base, 'scripts', 'kabam', 'rotmg', 'messaging', 'impl', 'GameServerConnection.as');
      expect(Updater.makeGSCPath(base)).to.equal(expected, 'Incorrect path returned.');
    });
    it('should return null for invalid inputs.', () => {
      expect(Updater.makeGSCPath(123 as any)).to.equal(null, 'Number input returned non-null.');
      expect(Updater.makeGSCPath(null)).to.equal(null, 'Null input returned non-null.');
      expect(Updater.makeGSCPath('')).to.equal(null, 'Empty string returned non-null.');
    });
  });
  describe('#extractPacketInfo()', () => {
    it('should extract packets from valid inputs.', () => {
      const VALID_SAMPLE = [
        'static const FAILURE:int = 0;',
        'static const CREATE_SUCCESS:int = 13;',
        'static const LOAD:int = 4;'
      ].join('\n');
      const packets = Updater.extractPacketInfo(VALID_SAMPLE);
      expect(packets).to.deep.equal({
        0: 'FAILURE',
        13: 'CREATE_SUCCESS',
        4: 'LOAD'
      }, 'Incorrect packet ids extracted.');
    });
    it('should return null for invalid inputs.', () => {
      expect(Updater.extractPacketInfo(1234 as any)).to.equal(null, 'Number returned non-null.');
      expect(Updater.extractPacketInfo(null)).to.deep.equal(null, 'Null returned non-null.');
    });
    it('should return an empty object if no packets were extracted.', () => {
      const INVALID_SAMPLE = [
        'public class GameServerConnection {',
        ' private test:int = 0',
        '}'
      ].join('\n');
      expect(Updater.extractPacketInfo(INVALID_SAMPLE)).to.deep.equal({}, 'Invalid sample non-empty object.');
    });
  });
});
