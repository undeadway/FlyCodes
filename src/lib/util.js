
exports.compireH5Video = (input, args) => {

	let result = `<iframe class="h5video" src="${input}"`;

	for (let k in args) {
		let v = args[k];
		result += ` ${k}="${v}"`;
	}

	result += ' frameborder="no"></iframe>';

	return result;
};

exports.compireH5Audio = (input, args) => {
	return input;
}

exports.splitEqualToObject = (input, obj) => {
	for (let item of input) {
		let kv = item.split("=");
		obj[kv[0]] = kv[1];
	}
};

exports.AspectBase = (key) => {

	let array = [];

	return {
		replace : (input, part, str) => {

			input = input.replace(part, `{${key}~${array.length}}`);
			array.push(str);

			return input;
		},
		after : (input) => {
			Array.forEach(array, (i, e) => {
				input = input.replace(`{${key}~${i}}`, e);
			});

			return input;
		}
	}

};