import { LogProvider, LogLevel } from '../modules/common/src';

/**
 * A logger which records each log message that passes through it.
 * Can be used to test logging functionality.
 */
export class TestLogger implements LogProvider {
  /**
   * A history of all log messages which have been
   * passed to `log`.
   */
  history: { sender: string, message: string, level: number }[];
	log(sender: string, message: string, level: LogLevel): void;
}