const m = require('mithril');

const Page = require('../page');

class CustomPage extends Page {
	constructor(app) {
		super(app, {
			path: '/auth/login',
			class: 'auth-login'
		});
	}

	view() {
		return [];
	}
}

module.exports = CustomPage;