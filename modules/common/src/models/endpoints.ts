/**
 * @module common/models
 */
/**
 * A list of HTTP endpoints commonly used for clientless applications.
 */
export enum Endpoints {
  /**
   * The endpoint used to retreive the list of servers and the character information about an account.
   */
  CHAR_LIST = 'https://realmofthemadgodhrd.appspot.com/char/list',
  /**
   * The endpoint used to retreive the latest resources.
   */
  STATIC_DRIPS = 'https://static.drips.pw/rotmg/production',
  /**
   * The endpoint used to check the version of the latest client.
   */
  VERSION = 'https://www.realmofthemadgod.com/version.txt',
  /**
   * The endpoint used to retrieve the latest client. `{{version}}` needs to be replaced with the current version before use.
   * @example
   * const downloadPath = Endpoints.GAME_CLIENT.replace('{{version}}', currentVersion);
   */
  GAME_CLIENT = 'https://www.realmofthemadgod.com/AssembleeGameClient{{version}}.swf'
}
