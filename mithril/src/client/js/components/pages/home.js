const m = require('mithril');

const Page = require('../page');
const Constants = require('../../utils').Constants;

class CustomPage extends Page {
	constructor(app) {
		super(app, {
			path: '/',
			class: 'home'
		});
	}

	initialize(args, requestedPath) {
		return true;
	}

	view() {
		return [
			m('div', {class: 'center-align'}, [
				m('h1', 'craig\'s bot list')
			]),
			m(this.app.components.botSearch)
		];
	}
}

module.exports = CustomPage;