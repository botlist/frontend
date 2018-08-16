const m = require('mithril');

const Page = require('../page');

class CustomPage extends Page {
	constructor(app) {
		super(app, {
			path: '/auth/login/callback',
			class: 'auth-login-callback'
		});
	}

	view() {
		return [];
	}
}

module.exports = CustomPage;