const m = require('mithril');

const Page = require('../page');

class CustomPage extends Page {
	constructor(app) {
		super(app, {
			path: '/tos',
			class: 'tos'
		});
	}

	view() {
		return [];
	}
}

module.exports = CustomPage;