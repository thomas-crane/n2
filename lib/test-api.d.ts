/**
 * Initialises an HTTP server which can be used to test HTTP clients.
 * @param zip Whether or not to gzip responses.
 * @param callback The callback to invoke when the server has finished initialising.
 */
export function init(zip: boolean, callback: () => void): void;
/**
 * Closes the HTTP server.
 * @param callback The callback to invoke when the server has finished closing.
 */
export function destroy(callback: () => void): void;