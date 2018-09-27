/**
 * @module core/models
 */
import { GroundTileData } from '@n2/net';

/**
 * Information about a map
 */
export interface MapInfo {
  /**
   * The name of the map.
   */
  name: string;
  /**
   * The size of the map.
   */
  size: number;
  /**
   * A table of the known tiles. For any tile at
   * the coordinates `(x, y)`, its index is `x + y * size`.
   */
  tiles: {
    [index: number]: GroundTileData;
  };
}
