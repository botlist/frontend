const m = require('mithril');

const Page = require('../page');

class CustomPage extends Page {
	constructor(app) {
		super(app, {
			path: '/auth/logout',
			class: 'auth-logout'
		});
	}

	view() {
		return [];
	}
}

module.exports = CustomPage;