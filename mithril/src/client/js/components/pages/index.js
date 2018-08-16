const Pages = [];

const forEachPage = (page) => {
	if (Array.isArray(page)) {
		page.forEach(forEachPage);
	} else {
		Pages.push(page);
	}
};

forEachPage([
	require('./home'),
	require('./auth.login.callback'),
	require('./auth.login'),
	require('./auth.logout'),
	require('./bots'),
	require('./users'),
	require('./tos'),
	require('./error.code')
]);

module.exports = Pages;