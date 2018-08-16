const m = require('mithril');

const Component = require('./component');

const title = 'Botlist';
const NavButtons = [
	{position: 'left', path: '/tos', name: 'Terms of Service'},
	{position: 'left', path: '/bots', name: 'Bots'},
	{position: 'left', path: '/users', name: 'Users'},
	{position: 'right', path: '/panel', name: 'Panel', authRequired: true},
	{position: 'right', path: '/auth/login', name: 'Login', class: 'login', authRequired: false},
	{position: 'right', path: '/auth/logout', name: 'Logout', class: 'logout', authRequired: true}
];

class Navbar extends Component {
	constructor(app) {
		super(app);

		this.instances = [];
	}

	createButtons(position) {
		return NavButtons.filter((button) => {
			return (position) ? button.position === position : true;
		}).map((button) => {
			if (button.authRequired !== undefined) {
				if (button.authRequired !== this.app.authed) {
					return null;
				}
			}
			return m('li', {class: button.class}, [
				m('a', {
					href: button.path,
					oncreate: m.route.link,
					onupdate: m.route.link
				}, button.name)
			])
		});
	}

	oncreate(vnode) {
		const elements = document.querySelectorAll('.sidenav');
		for (let instance of M.Sidenav.init(elements)) {
			this.instances.push(instance);
		}
	}

	onremove(vode) {
		while (this.instances.length) {
			this.instances.shift().destroy();
		}
	}

	view(vnode) {
		return [
			m('div', {class: 'navbar-fixed'}, [
				m('nav', {class: 'bot-nav'}, [
					m('div', {class: 'container'}, [
						m('div', {class: 'nav-wrapper'}, [
							m('a[href=/]', {oncreate: m.route.link, class: 'bot-nav-brand'}, title),
							m('ul', {class: 'bot-nav-category left'}, this.createButtons('left')),
							m('ul', {class: 'bot-nav-category right'}, this.createButtons('right')),
							m('ul', {class: 'sidenav', id: 'nav-mobile'}, this.createButtons()),
							m('a', {href: '#', class: 'sidenav-trigger', 'data-target': 'nav-mobile'}, [
								m('i', {class: 'material-icons'}, 'menu')
							])
						])
					])
				])
			])
		];
	}
}

module.exports = Navbar;