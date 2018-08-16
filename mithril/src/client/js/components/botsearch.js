const m = require('mithril');

const Component = require('./component');

class BotSearch extends Component {
	get value() {
		return this.app.values.botSearch;
	}

	setValue(value) {
		this.app.values.botSearch = value || '';
	}

	search() {
		const search = this.value;
		return (search) ? m.route.set('/bots', {search}) : null;
	}

	view() {
		return [
			m('div', {class: 'bot-search'}, [
				m('div', {class: 'field'}, [
					m('i', {
						class: 'prefix material-icons',
						onclick: this.search.bind(this)
					}, 'search'),
					m('input', {
						type: 'search',
						id: 'search',
						oninput: m.withAttr('value', this.setValue.bind(this)),
						onkeyup: ({code}) => (code === 'Enter') ? this.search() : null,
						value: this.value
					}),
					m('label', {
						for: 'search',
						class: (this.value) ? 'active' : undefined
					}, 'Search')
				])
			])
		];
	}
}

module.exports = BotSearch;