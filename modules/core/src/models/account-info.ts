/**
 * @module core/models
 */
import { Character } from './character';

/**
 * The character information of an account.
 */
export interface AccountInfo {
  /**
   * The next character id of this account.
   */
  nextCharacterId: number;
  /**
   * The number of character slots this account has.
   */
  characterSlots: number;
  /**
   * The characters owned by this account.
   */
  characters: Character[];
}
