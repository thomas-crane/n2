/**
 * @module common/models
 */
/**
 * A 2d point in space.
 */
export class Point {
  /**
   * The X value of this point.
   */
  x: number;
  /**
   * The Y value of this point.
   */
  y: number;

  /**
   * Creates a new point at the origin or at the provided, x, y.
   * @param x An x value for this point. Defaults to 0.
   * @param y A y value for this point. Defaults to 0.
   */
  constructor(x?: number, y?: number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  /**
   * Returns the square distance between this point and the other point.
   * @param point The other point.
   */
  squareDistanceTo(point: Point): number {
    if (!(point instanceof Point) || !point) {
      throw new TypeError(`Parameter "point" must be a Point, not ${typeof point}`);
    }
    const a = point.x - this.x;
    const b = point.y - this.y;
    return a ** 2 + b ** 2;
  }

  /**
   * Returns the distance between this point and the other point.
   * @param point The other point.
   */
  distanceTo(point: Point): number {
    return Math.sqrt(this.squareDistanceTo(point));
  }

  /**
   * Returns a new `Point` which has the same x and y values.
   */
  clone(): Point {
    return new Point(this.x, this.y);
  }
}
