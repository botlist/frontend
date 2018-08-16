const m = require('mithril');

const Utils = require('./utils');

const Endpoints = Utils.Constants.Endpoints.Api;
const Tools = Utils.Tools;

const defaults = {
	baseUrl: Endpoints.URL + Endpoints.PATH,
	background: true
};

class Route {
	constructor(path, params) {
		this.path = path;

		this.urlPath = this.path;
		for (let key in (params || {})) {
			this.urlPath = this.urlPath.replace(`:${key}:`, encodeURIComponent(params[key]));
		}

		this.params = params;
	}
}

class Rest {
	constructor(app, options) {
		Object.defineProperty(this, 'app', {value: app});

		Object.defineProperties(this, {
			baseUrl: {enumerable: true, configurable: true, value: null},
			headers: {enumerable: true, configurable: true, value: null},
			token: {enumerable: true, configurable: true, value: null}
		});

		options = Object.assign({}, defaults, options);
		if (options.baseUrl) {
			this.setBaseUrl(options.baseUrl);
		}
	}

	setBaseUrl(baseUrl) {
		Object.defineProperty(this, 'baseUrl', {value: new window.URL(baseUrl)});
	}

	setHeaders(value) {
		Object.defineProperty(this, 'headers', {value});
	}

	setHeader(key, value) {
		const headers = Object.assign({}, this.headers);
		headers[key] = value;
		this.setHeaders(headers);
	}

	setToken(value) {
		Object.defineProperty(this, 'token', {value});
	}

	request(options) {
		options = Object.assign({}, defaults, options);

		if (!this.baseUrl && !options.url) {
			return Promise.reject(new Error('Specify a URL next time'));
		}

		const url = new window.URL(options.url || this.baseUrl);
		if (options.route || options.path) {
			if (typeof(options.route) !== 'object') {options.route = {};}
			if (!(options.route instanceof Route)) {
				options.route = new Route(
					options.route.path || options.path,
					options.route.params || {}
				);
			}
		}
		if (options.route) {
			url.pathname += options.route.urlPath;
		}
		if (options.query) {
			for (let key in options.query) {
				if (options.query[key] === undefined) {
					continue;
				}
				url.searchParams.set(key, options.query[key]);
			}
		}
		options.url = url.href;

		if (this.headers) {
			options.headers = Object.assign({}, options.headers, this.headers);
		}

		if (options.useAuth) {
			Object.assign(options.headers, {'authorization': this.token});
		}

		return m.request(options);
	}

	fetchBots({search, sort}) {
		return this.request({
			method: 'get',
			path: Endpoints.Bots.ALL,
			query: {search, sort}
		});
	}

	fetchBot(botId) {
		return this.request({
			method: 'get',
			route: {
				path: Endpoints.Bots.ID,
				params: {botId}
			}
		});
	}
}

Rest.Route = Route;
module.exports = Rest;