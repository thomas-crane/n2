import { expect } from 'chai';
import 'mocha';

import { Mapper, PacketIdMap } from '../src';
import { Logger, LogLevel } from '@n2/common';
import { TestLogger } from '../../../lib/test-logger';

describe('Mapper', () => {
  describe('#mapIds()', () => {
    it('should populate the map and the reverseMap for valid inputs.', () => {
      Mapper.mapIds({
        0: 'FAILURE',
        1: 'CREATE_SUCCESS'
      } as PacketIdMap);
      const packetIds = [...Mapper.map];
      expect(packetIds).to.deep.equal([
        [0, 'FAILURE'],
        [1, 'CREATE_SUCCESS']
      ]);
      const reverseIds = [...Mapper.reverseMap];
      expect(reverseIds).to.deep.equal([
        ['FAILURE', 0],
        ['CREATE_SUCCESS', 1]
      ]);
    });
    it('should produce a warning when an invalid packet type is provided.', () => {
      Logger.resetLoggers();
      const logger = new TestLogger();
      Logger.addLogger(logger);

      Mapper.mapIds({
        0: 'TEST_PACKET'
      } as any);
      expect(logger.history[0].level).to.equal(LogLevel.Warning);
    });
    it('should produce an error for invalid inputs.', () => {
      expect(() => Mapper.mapIds(123 as any)).to.throw();
      expect(() => Mapper.mapIds(null)).to.throw();
    });
  });
});
