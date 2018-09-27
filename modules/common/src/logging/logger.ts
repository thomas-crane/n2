/**
 * @module common/logging
 */
import { LogLevel } from './log-level';
import { LogProvider } from './log-provider';

/**
 * A static singleton class used to expose the logging mechanism.
 *
 * Logging is provided through the use of a logging chain. When `log`
 * is called, the logger iterates over each logger in the chain calling
 * `log` on each individual logger.
 */
export class Logger {
  static loggers: LogProvider[] = [];

  /**
   * Adds a new logger to the end of the logging chain.
   */
  static addLogger(logger: LogProvider): void {
    if (!logger || typeof logger.log !== 'function') {
      throw new TypeError(`Parameter "logger" must be a LogProvider, not ${typeof logger}`);
    }
    this.loggers.push(logger);
  }
  /**
   * Clears the logging chain.
   */
  static resetLoggers(): void {
    this.loggers = [];
  }
  /**
   * Logs a message using each logger in the chain.
   * @param sender The sender of the message.
   * @param message The message.
   * @param level The level of the message.
   */
  static log(sender: string, message: string, level: LogLevel = LogLevel.Message): void {
    for (const logger of this.loggers) {
      try {
        logger.log(sender, message, level);
      } catch (error) {
        // console.log is the only reliable logger at this point.
        // tslint:disable:no-console
        console.log(`${logger.constructor.name}.log() threw an error:`);
        console.error(error);
      }
    }
  }
}
