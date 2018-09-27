import { expect } from 'chai';
import 'mocha';

import { Logger, LogLevel } from '../src';
import { TestLogger } from '../../../lib/test-logger';

describe('Logger', () => {
  it('should start with an empty logging chain.', () => {
    expect(Logger.loggers.length).to.equal(0, 'Incorrect initial chain length.');
  });

  const testLogger = new TestLogger();
  describe('#addLogger()', () => {
    it('should add the logger to the logging chain if the input is valid.', () => {
      Logger.addLogger(testLogger);
      expect(Logger.loggers[0]).instanceof(TestLogger, 'Logger not added to logging chain.');
    });
    it('should throw a TypeError if the input is not valid.', () => {
      expect(() => Logger.addLogger(123 as any)).to.throw(TypeError);
      expect(() => Logger.addLogger({ test: (x: number) => x + 1 } as any)).to.throw(TypeError);
      expect(() => Logger.addLogger(((str: string) => `${str}!!`) as any)).to.throw(TypeError);
    });
  });

  describe('#log()', () => {
    it('should call the log method on each logger in the chain.', () => {
      const secondLogger = new TestLogger();
      Logger.addLogger(secondLogger);
      Logger.log('test', 'message', LogLevel.Info);
      expect(testLogger.history[0]).to.deep.equal({
        sender: 'test',
        message: 'message',
        level: LogLevel.Info
      }, 'log method not called on first logger');
      expect(secondLogger.history[0]).to.deep.equal({
        sender: 'test',
        message: 'message',
        level: LogLevel.Info
      }, 'log method not called on second logger');
    });
  });

  describe('#resetLoggers()', () => {
    it('should clear the logging chain.', () => {
      Logger.resetLoggers();
      expect(Logger.loggers.length).to.equal(0, 'Chain not reset.');
    });
  });
});
