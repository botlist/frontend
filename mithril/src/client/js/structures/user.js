const BaseStructure = require('./basestructure');

const Utils = require('../utils');

const DiscordCDN = Utils.Constants.Discord.Endpoints.CDN;
const DiscordRoutes = Utils.Constants.Discord.Endpoints.Routes;

const Routes = Utils.Constants.Endpoints.Routes;

const defaults = {
	id: null,
	avatar: null,
	discriminator: '0000',
	username: ''
};

class User extends BaseStructure {
	constructor(app, data) {
		super(app, data, defaults);
	}

	get createdAt() {return new Date(this.createdAtUnix);}
	get createdAtUnix() {return Utils.Snowflake.timestamp(this.id);}
	get mention() {return `<@${this.id}>`;}

	get botlistJumpLink() {
		return Routes.USER(this.id);
	}

	get discordJumpLink() {
		return DiscordRoutes.URL + DiscordRoutes.USER(this.id);
	}

	get avatarUrl() {return this.avatarUrlFormat();}
	get defaultAvatarUrl() {return DiscordCDN.URL + DiscordCDN.AVATAR_DEFAULT(this.discriminator % 5);}

	avatarUrlFormat(format) {
		if (!this.avatar) {return this.defaultAvatarUrl;}

		const hash = this.avatar;
		if (!format) {
			format = 'png';
			if (hash.slice(0, 2) === 'a_') {
				format = 'gif';
			}
		}
		format = format.toLowerCase();

		const valid = ['png', 'jpeg', 'jpg', 'webp', 'gif'];
		if (!valid.includes(format)) {
			throw new Error(`Invalid format: '${format}', valid: ${JSON.stringify(valid)}`);
		}
		return DiscordCDN.URL + DiscordCDN.AVATAR(this.id, hash, format);
	}

	toString() {return `${this.username}#${this.discriminator}`;}
}

module.exports = User;