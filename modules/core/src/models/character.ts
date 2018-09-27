/**
 * @module core/models
 */
import { PlayerData } from '@n2/common';

/**
 * Information about a character for Realm of the Mad God.
 */
export interface Character {
  /**
   * The ID of the character.
   */
  id: number;
  /**
   * The character's stats.
   */
  playerData: PlayerData;
}
