class Cache extends Map {
	constructor(expiresIn) {
		super();

		Object.defineProperties(this, {
			expiresIn: {enumerable: true, configurable: true, value: 0}
		});

		if (expiresIn) {
			this.setExpiresIn(expiresIn);
		}
	}

	setExpiresIn(value) {
		Object.defineProperty(this, 'expiresIn', {value});
	}

	delete(id) {
		if (!this.has(id)) {return;}

		const item = super.get(id);
		if (item.expire) {
			clearTimeout(item.expire);
		}
		return super.delete(id);
	}

	get(id) {
		return (super.has(id)) ? super.get(id).value : null;
	}

	set(id, value, expiresIn) {
		if (expiresIn === undefined) {
			expiresIn = this.expiresIn;
		}

		super.set(id, {
			value,
			expire: (expiresIn) ? setTimeout(() => {
				this.delete(id);
			}, expiresIn * 1000) : null
		});
	}
}

module.exports = Cache;