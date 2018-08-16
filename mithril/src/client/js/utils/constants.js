module.exports = {
	Discord: {
		Endpoints: {
			Api: {
				URL: 'https://discordapp.com',
				PATH: '/api/v7',

				OAUTH2: {
					AUTHORIZE: '/oauth2/authorize'
				}
			},
			CDN: {
				URL:                                      'https://cdn.discordapp.com',
				AVATAR:   (userId, hash, format='png') => `/avatars/${userId}/${hash}.${format}`,
				AVATAR_DEFAULT:  (discriminatorModulo) => `/embed/avatars/${discriminatorModulo}.png`
			},
			Invite: {
				LONG:  (code) => `https://discordapp.com/invite/${code}`,
				SHORT: (code) => `https://discord.gg/${code}`
			},
			Routes: {
				URL:              'discord://web',
				USER: (userId) => `/users/${userId}`
			}
		},
		Epoch: {
			SNOWFLAKE: 1420070400000,
			TOKEN: 1293840000
		}
	},
	Endpoints: {
		Api: {
			URL: 'https://api.botlist.gg',
			PATH: '/v1',

			Auth: {
				LOGIN: '/auth/login'
			},
			Bots: {
				ALL: '/bots',
				ID: '/bots/:botId:'
			}
		},
		Routes: {
			HOME:         '/',
			BOTS:         '/bots',
			BOT:  (id) => `/bots/${id}`,
			USERS:        '/users',
			USER: (id) => `/users/${id}`
		}
	}
};