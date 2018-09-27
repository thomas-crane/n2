/**
 * @module core/models
 */
/**
 * A server which can be connected to by a clientless application.
 */
export interface Server {
  /**
   * The name of the server.
   */
  name: string;
  /**
   * The IP of the server.
   */
  ip: string;
  /**
   * The location of the server.
   */
  location: {
    /**
     * The latitude of the location.
     */
    lat: number;
    /**
     * The longitude of the location.
     */
    long: number;
  };
  /**
   * The usage of the server.
   */
  usage: number;
}
