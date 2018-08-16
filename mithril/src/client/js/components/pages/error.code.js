const m = require('mithril');

const Page = require('../page');
const Constants = require('../../utils').Constants;

class CustomPage extends Page {
	constructor(app) {
		super(app, {
			path: '/error/:code',
			class: 'error'
		});
	}

	intialize(args, requestedPath) {
		console.log(args);
	}

	view() {
		return [
			m('div', {class: 'center-align'}, [
				m('h1', '¯\\_(ツ)_/¯')
			])
		];
	}
}

module.exports = CustomPage;