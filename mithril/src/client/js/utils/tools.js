module.exports.toCamelCase = function(value) {
	value = (value || '').split('_').map((v) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()).join('');
	return value.charAt(0).toLowerCase() + value.slice(1);
};