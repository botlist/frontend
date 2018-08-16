const BaseStructure = require('./basestructure');

const Structures = {
	User: require('./user')
};

const Utils = require('../utils');

const DiscordApi = Utils.Constants.Discord.Endpoints.Api;
const DiscordCDN = Utils.Constants.Discord.Endpoints.CDN;
const DiscordInvite = Utils.Constants.Discord.Endpoints.Invite;
const DiscordRoutes = Utils.Constants.Discord.Endpoints.Routes;

const Routes = Utils.Constants.Endpoints.Routes;

const defaults = {
	id: null,
	added: null,
	authors: [],
	avatar: null,
	discriminator: '0000',
	description_long: '',
	description_short: 'I am a very simple bot. I\'ve been coded by javascript developers, please invite me!',
	invite_code: 'discord-api',
	picture: '',
	permissions: 0,
	servers: 0,
	upvotes: 0,
	username: ''
};

class Bot extends BaseStructure {
	constructor(app, data) {
		super(app, data, defaults);
	}

	get addedAt() {return new Date(this.addedAtUnix);}
	get addedAtUnix() {return this.added;}
	get createdAt() {return new Date(this.createdAtUnix);}
	get createdAtUnix() {return Utils.Snowflake.timestamp(this.id);}
	get mention() {return `<@${this.id}>`;}

	get botlistJumpLink() {
		return Routes.BOT(this.id);
	}

	get discordJumpLink() {
		return DiscordRoutes.URL + DiscordRoutes.USER(this.id);
	}
	get discordOauth2Link() {
		const url = new window.URL(DiscordApi.URL + DiscordApi.PATH);
		url.pathname += DiscordApi.OAUTH2.AUTHORIZE;
		url.searchParams.set('scope', 'bot');
		if (this.permissions) {
			url.searchParams.set('permissions', this.permissions);
		}
		url.searchParams.set('client_id', this.id);
		return url.href;
	}
	get discordServerLink() {
		return DiscordInvite.SHORT(this.inviteCode);
	}

	get pictureUrl() {
		return this.avatarUrl + '?size=1024' || 'https://materializecss.com/images/sample-1.jpg';
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

	mergeValue(key, value) {
		switch(key) {
			case 'authors': {
				let authors = [];
				
				for (let raw of value) {
					const author = new Structures.User(this.app, raw);
					authors.push(author);
				}

				value = authors;
			}; break;
		}

		super.mergeValue.call(this, key, value);
	}

	toString() {return `${this.username}#${this.discriminator}`;}
}

module.exports = Bot;