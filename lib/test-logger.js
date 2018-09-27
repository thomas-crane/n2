/**
 * A class used to test logging. Keeps a history of all logging calls made.
 */
exports.TestLogger = class TestLogger {
	
	constructor() {
		/**
		 * @type { { sender: string, message: string, level: number }[] }
		 */
		this.history = [];
	}

	log(sender, message, level) {
		this.history.push({
			sender, message, level
		});
	}
}