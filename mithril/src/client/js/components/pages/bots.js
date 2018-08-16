const m = require('mithril');

const Structures = {
	Bot: require('../../structures/bot')
};

const Page = require('../page');
const Constants = require('../../utils').Constants;

class CustomPage extends Page {
	constructor(app) {
		super(app, {
			paths: ['/bots', '/bots/:bid'],
			class: 'bots'
		});

		this.botId = null;
		this.instances = [];
	}

	get bots() {
		return (this.cache.has('search.bots')) ? this.cache.get('search.bots').value : [];
	}

	get bot() {
		return (this.cache.has(`search.bots.${this.botId}`)) ? this.cache.get(`search.bots.${this.botId}`) : null;
	}

	initialize(args, requestedPath) {
		return new Promise((resolve, reject) => {
			if (args.search === undefined) {
				const search = this.app.components.botSearch.value;
				if (search) {
					return resolve(m.route.set(requestedPath, {search}));
				}
			} else {
				this.app.components.botSearch.setValue(args.search);
			}

			if (args.bid === undefined) {
				if (this.botId) {
					this.cache.delete(`search.bots.${this.botId}`);
				}
				this.botId = null;
			} else {
				this.botId = args.bid;
			}

			const key = 'search.bots';
			if (this.cache.has(key)) {
				const cache = this.cache.get(key);
				if (cache.search === args.search) {
					return resolve(cache.value);
				}
			}

			this.rest.fetchBots(args).then((bots) => {
				bots = bots.map((bot) => new Structures.Bot(this.app, bot));
				this.cache.set(key, {
					search: args.search,
					sort: args.sort,
					value: bots
				});
				resolve(bots);
			}).catch(reject);
		}).then((bots) => {
			if (this.botId === null) {return;}

			//fetch bot for expanded info
			//always fetch so new info each time
			return new Promise((resolve, reject) => {
				const key = `search.bots.${this.botId}`;

				let found = bots.find((bot) => bot.id === this.botId);
				if (found) {
					this.cache.set(key, found);
					resolve();
				} else {
					this.rest.fetchBot(this.botId).then((bot) => {
						this.cache.set(key, new Structures.Bot(this.app, bot));
						resolve();
					}).catch(reject);
				}
			});
		});
	}

	oncreate(vnode) {
		const elements = document.querySelectorAll('.tabs');
		for (let instance of M.Tabs.init(elements)) {
			this.instances.push(instance);
		}
	}

	onremove(vode) {
		while (this.instances.length) {
			this.instances.shift().destroy();
		}
	}

	view() {
		const moment = require('moment');

		const bots = this.bots;
		const page = [];
		page.push([
			m(this.app.components.botSearch),
			m('div', {class: 'bots'}, bots.map((bot) => {
				let description = bot.descriptionShort.trim();
				if (description.length >= 200) {
					description = description.slice(0, 197).trim() + '...';
				}
				return m('div', {class: 'bot'}, [
					m('div', {
						class: 'new-card',
						style: {'background-image': `url(${bot.avatarUrl}?size=128)`},
						onclick: () => m.route.set(bot.botlistJumpLink)
					}, [
						m('div', {class: 'grid'}, [
							m('div', {class: 'avatar'}, [
								m('img', {src: `${bot.avatarUrl}?size=128`})
							]),
							m('div', {class: 'header'}, [
								m('div', {class: 'title'}, [
									m('div', {class: 'username'}, [
										m('span', bot.username),
										(bots.find((b) => b.id !== bot.id && b.username === bot.username)) ? m('span', {
											class: 'discriminator'
										}, `#${bot.discriminator}`) : null,
									])
									//badges here
								]),
								m('div', {class: 'description'}, [
									m('p', description)
								]),
								m('div', {class: 'upvotes'}, [
									m('i', {class: 'material-icons'}, 'expand_less'),
									m('span', bot.upvotes.toLocaleString())
								])
							]),
							m('div', {class: 'invite'}, [
								m('a', {
									href: bot.discordOauth2Link,
									target: '_blank'
								}, 'Invite')
							]),
							m('div', {class: 'details'}, [
								m('div', {class: 'counts'}, [
									m('div', {class: 'servers'}, [
										m('span', (bot.servers === null) ? 'N/A' : `${bot.servers.toLocaleString()} Servers`)
									])
								]),
								m('div', {class: 'authors'}, bot.authors.map((author) => {
									return [
										m('a', {
											href: author.botlistJumpLink,
											oncreate: m.route.link,
											onupdate: m.route.link,
											class: 'author tooltipped',
											'data-position': 'bottom',
											'data-tooltip': author.toString(),
											style: {'background-image': `url(${author.avatarUrl}?size=128)`}
										})
									];
								}))
							])
						])
						/*
						m('div', {class: 'card-image'}, [
							m('img', {src: bot.pictureURL}),
							m('div', {
								class: 'avatar',
								style: {'background-image': `url(${bot.avatarURL}?size=128)`}
							}),
							m('div', {class: 'upvotes'}, [
								m('span', [
									m('i', {class: 'material-icons'}, 'expand_less'),
									bot.upvotes.toLocaleString()
								])
							])
						]),
						m('div', {class: 'card-stacked'}, [
							m('div', {class: 'card-content'}, [
								m('span', {class: 'card-title'}, [
									m('span', {class: 'username'}, bot.username),
									(bots.find((b) => b.id !== bot.id && b.username === bot.username)) ? m('span', {
										class: 'discriminator'
									}, `#${bot.discriminator}`) : null
								]),
								m('span', {class: 'description'}, bot.descriptionShort)
							]),
							m('div', {class: 'card-action'}, [
								m('a', {
									href: bot.botlistJumpLink,
									oncreate: m.route.link,
									onupdate: m.route.link
								}, 'Details'),
								m('a', {
									href: bot.discordOauth2Link,
									target: '_blank'
								}, 'Invite'),
								(bot.inviteCode) ? m('a', {
									href: bot.discordServerLink,
									target: '_blank'
								}, 'Server') : null
							])
						])*/
						/*
						m('div', {class: 'card-tabs'}, [
							m('ul', {class: 'tabs tabs-fixed-width'}, [
								m('li', {class: 'tab'}, [
									m('a', {href: `#${bot.id}-information`}, 'Info')
								]),
								m('li', {class: 'tab'}, [
									m('a', {href: `#${bot.id}-links`}, 'Links')
								])
							])
						]),
						m('div', {class: 'card-tabs-content'}, [
							m('div', {
								class: 'information',
								id: `${bot.id}-information`
							}, [
								m('p', `Created: ${createdAt}`),
								m('p', `Added: ${addedAt}`),
								m('p', [
									'Bot Owners: ',
									(bot.authors.length) ? bot.authors.map((author) => {
										return m('a', {
											href: author.botlistJumpLink,
											oncreate: m.route.link,
											onupdate: m.route.link,
											class: 'author'
										}, author.toString());
									}) : 'Nobody yet'
								]),
								m('div', {class: 'link'}, [
									m('a', {
										href: bot.botlistJumpLink,
										oncreate: m.route.link,
										onupdate: m.route.link
									}, 'More Info')
								])
							]),
							m('div', {
								class: 'links',
								id: `${bot.id}-links`
							}, [
								m('div', {class: 'link'}, [
									m('a', {
										href: bot.discordOauth2Link,
										target: '_blank'
									}, 'Invite Link')
								]),
								m('div', {class: 'link'}, [
									m('a', {
										href: bot.discordServerLink,
										target: '_blank'
									}, 'Server')
								]),
								m('div', {class: 'link'}, [
									m('a', {
										href: bot.discordJumpLink,
										target: '_blank'
									}, 'Jump Link')
								])
							])
						])*/
					])
				])
			}))
		]);

		if (this.botId) {
			const bot = this.bot;
			if (bot) {
				const addedAt = moment(bot.addedAtUnix).calendar();
				const createdAt = moment(bot.createdAtUnix).calendar();

				page.push([
					m('div', {
						class: 'bot-overlay',
						onclick: (event) => {
							if (event.target.className === 'bot-overlay') {
								return m.route.set('/bots');
							}
						}
					}, [
						m('div', {class: 'close'}, [
							m('i', {
								class: 'material-icons',
								onclick: () => m.route.set('/bots')
							}, 'close')
						]),
						m('div', {class: 'container'}, [
							m('div', {class: 'bot-information'}, [
								m('div', {class: 'bot-header'}, [
									m('div', {class: 'details'}, [
										m('span', {class: 'avatar'}, [
											m('a', {
												style: {'background-image': `url(${bot.avatarUrl}?size=128)`}
											})
										]),
										m('span', {class: 'username'}, bot.username),
										m('span', {class: 'discriminator'}, `#${bot.discriminator}`)
									])
								])
							])
						])
					])
				]);
			} else {
				console.error('bot not in cache for some reason');
			}
		}
		return page;
	}
}

module.exports = CustomPage;