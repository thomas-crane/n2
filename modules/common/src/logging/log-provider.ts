/**
 * @module common/logging
 */
import { LogLevel } from './log-level';
/**
 * A class which can be used to provide logging or output.
 */
export interface LogProvider {
  /**
   * Log a message.
   * @param sender The sender of the log message.
   * @param message The log message.
   * @param level The level of the log message.
   */
  log(sender: string, message: string, level: LogLevel): void;
}
