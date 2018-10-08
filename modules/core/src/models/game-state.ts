/**
 * @module core/models
 */
/**
 * An object representing the state of a client which is connecting to the game server.
 */
export interface GameState {
  /**
   * The build version of this state.
   */
  buildVersion: string;
  /**
   * The character id of this state.
   */
  characterId: number;
  /**
   * The game ID of this state.
   */
  gameId: number;
  /**
   * The key of this state.
   */
  key: number[];
  /**
   * The key time of this state.
   */
  keyTime: number;
}

export function isGameState(gameState: any): gameState is GameState {
  return gameState
    && typeof gameState.buildVersion === 'string'
    && typeof gameState.characterId === 'number'
    && typeof gameState.gameId === 'number';
}
