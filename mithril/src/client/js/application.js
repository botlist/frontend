const m = require('mithril');

const Rest = require('./rest');
const Utils = require('./utils');

class Application {
	constructor(prefix) {
		m.route.prefix(prefix || '');

		this.cache = new Utils.Cache(3600);
		this.rest = new Rest(this);

		this.components = {};
		this.pages = {};

		this.values = {};
	}

	get currentRoute() {
		return m.route.get().split('?').shift();
	}

	get authed() {
		return this.cache.has('users.me');
	}

	clearAuth() {
		if (localStorage.token) {
			localStorage.removeItem('token');
		}
	}

	getAuth() {
		if (localStorage.token) {
			const token = JSON.parse(localStorage.getItem('token'));
			this.rest.setToken(token);
		} else {
			this.rest.setToken(null);
		}
	}

	setAuth(token) {
		localStorage.token = JSON.stringify(token);
		this.rest.setToken(token);
	}

	tryAuth() {
		return new Promise((resolve, reject) => {
			//maybe check cache, idk
			if (!this.rest.token) {
				return reject(new Error('No token to auth with'));
			}

			this.rest.request({
				method: 'get',
				path: '/api/users/@me',
				query: {connections: true},
				useAuth: true
			}).then((data) => {
				this.cache.set('users.me', data, 0);
				resolve(data);
			}).catch(reject);
		});
	}

	setBotSearch(text) {
		Object.defineProperty(this, 'botSearch', {value: text || ''});
	}

	onmatch(page, args, requestedPath) {
		return Promise.resolve().then(() => {
			if (page.authRequired && !this.authed) {
				this.clearAuth();
				return Promise.reject('/auth/login');
			}
			if (page.initialize) {
				return page.initialize(args, requestedPath);
			}
		}).then(() => {
			return page;
		}, (path) => {
			if (path instanceof Error) {
				console.error(path);
				path = '/auth/login';
			}
			return m.route.set(path);
		});
	}

	render(page, vnode) {
		return [
			m(this.components.navbar),
			m('div', {class: page.class}, vnode)
		];
	}

	start() {
		return new Promise((resolve) => {
			require(['./bootstrap'], resolve);
		}).then(() => {
			return new Promise((resolve) => {
				require(['./components'], resolve);
			}).then((Components) => {
				this.components.navbar = new Components.Navbar(this);
				this.components.botSearch = new Components.BotSearch(this);

				Components.Pages.forEach((Page) => {
					const page = new Page(this);
					const route = {
						onmatch: this.onmatch.bind(this, page),
						render: this.render.bind(this, page)
					};

					page.paths.forEach((path) => {
						if (path in this.pages) {
							return console.error(new Error(`${path} is already taken, skipping.`));
						}
						this.pages[path] = route;
					});
				});
			});
		}).then(() => {
			if (localStorage.token) {
				this.getAuth();
				return this.tryAuth();
			} else {
				return Promise.resolve();
			}
		}).catch(console.error).then(() => {
			m.route(document.getElementById('app'), '/error/404', this.pages);
		});
	}
}

module.exports = Application;