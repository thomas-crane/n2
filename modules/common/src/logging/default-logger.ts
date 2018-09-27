/**
 * @module common/logging
 */
import chalk from 'chalk';
import { LogProvider } from './log-provider';
import { LogLevel } from './log-level';

/**
 * The default logger used by the CLI.
 */
export class DefaultLogger implements LogProvider {

  constructor(private minLevel: LogLevel = LogLevel.Info) { }

  log(sender: string, message: string, level: LogLevel): void {
    if (level < this.minLevel) {
      return;
    }
    const senderString = (`[${getTime()} | ${sender}]`);
    let printString: string = pad(senderString, 30) + message;
    switch (level) {
      case LogLevel.Debug:
      case LogLevel.Info:
        printString = chalk.gray(printString);
        break;
      case LogLevel.Warning:
        printString = chalk.yellow(printString);
        break;
      case LogLevel.Error:
        printString = chalk.red(printString);
        break;
      case LogLevel.Success:
        printString = chalk.green(printString);
        break;
    }
    // tslint:disable-next-line:no-console
    console.log(printString);
  }
}

/**
 * Returns a string which is at least `paddingLength` characters long, which
 * contains the original `str` and spaces to fill the remaining space if there is any.
 * @param str The string to pad.
 * @param paddingLength The number of spaces to add.
 */
function pad(str: string, paddingLength: number): string {
  if (str.length > paddingLength) {
    return str;
  }
  return (str + ' '.repeat(paddingLength - str.length));
}

/**
 * Returns the current time in HH:mm:ss format.
 */
function getTime(): string {
  const now = new Date();
  return now.toTimeString().split(' ')[0];
}
