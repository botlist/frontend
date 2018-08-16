class Component {
	constructor(app) {
		Object.defineProperty(this, 'app', {value: app});
	}

	get cache() {
		return this.app.cache;
	}

	get rest() {
		return this.app.rest;
	}
}

module.exports = Component;