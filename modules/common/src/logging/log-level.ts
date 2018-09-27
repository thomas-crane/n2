/**
 * @module common/logging
 */
/**
 * A description of the nature of a log message.
 * Since the levels also represent values (`Debug` is `0`, and `Success` is `5`), they may be
 * used to filter out messages before logging.
 * @example
 * if (level < LogLevel.Message) return; // ignore Debug and Info.
 */
export enum LogLevel {
  /**
   * For debug purposes, and probably
   * only needs to be logged when running in a debug environment.
   */
  Debug,
  /**
   * Used to log progress of a long running task, or the state of
   * a system.
   */
  Info,
  /**
   * The standard level of output. Similar to `console.log`.
   */
  Message,
  /**
   * Used when an error has occurred which is not fatal.
   */
  Warning,
  /**
   * Used when a fatal error has occurred that prevents some
   * part of the program from functioning correctly.
   */
  Error,
  /**
   * Used when an operation has completed successfully.
   */
  Success,
}
