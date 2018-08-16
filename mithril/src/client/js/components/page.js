const m = require('mithril');

const Component = require('./component');

const defaults = {
	authRequired: false,
	class: []
};

class Page extends Component {
	constructor(app, options) {
		super(app);

		options = Object.assign({}, defaults, options);
		options.class = ['page'].concat(options.class).filter((v) => v).join(' ');

		if (!Array.isArray(options.paths)) {
			options.paths = [];
		}
		if (options.path) {
			options.paths.push(options.path);
		}

		Object.defineProperties(this, {
			authRequired: {enumerable: true, writable: true, value: options.authRequired},
			class: {enumerable: true, writable: true, value: options.class},
			paths: {enumerable: true, value: options.paths}
		});
	}

	hasPath(path) {return this.paths.includes(path);}
}

module.exports = Page;