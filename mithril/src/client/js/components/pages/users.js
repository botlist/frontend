const m = require('mithril');

const Page = require('../page');

class CustomPage extends Page {
	constructor(app) {
		super(app, {
			paths: ['/users', '/users/:uid'],
			class: 'users'
		});
	}

	view() {
		return [];
	}
}

module.exports = CustomPage;